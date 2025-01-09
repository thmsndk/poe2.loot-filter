import * as fs from "fs/promises";
import { existsSync, readFileSync } from "fs";
import { watch } from "fs";
import * as path from "path";

interface DeathEvent {
  timestamp: string;
  character: string;
}

interface DeathStats {
  totalDeaths: number;
  characterDeaths: Record<string, number>;
}

class DeathTracker {
  private deathEvents: DeathEvent[] = [];
  private stats: DeathStats;
  private outputDir: string = "death-stats";
  private statsFile: string = "death-stats/stats.json";
  private logPath: string =
    "D:\\SteamLibrary\\steamapps\\common\\Path of Exile 2\\logs\\Client.txt";
  private lastPosition: number = 0;

  constructor() {
    console.log("🚀 Initializing Death Tracker...");
    this.stats = this.loadStats();
    fs.mkdir(this.outputDir, { recursive: true })
      .then(() => {
        console.log(
          `📊 Loaded existing stats: ${this.stats.totalDeaths} total deaths`
        );
      })
      .catch((error) => {
        console.error("❌ Error creating output directory:", error);
      });
  }

  private loadStats(): DeathStats {
    if (existsSync(this.statsFile)) {
      const data = JSON.parse(readFileSync(this.statsFile, "utf-8"));
      return data;
    }
    console.log("⚠️ No existing stats found, starting fresh");
    return {
      totalDeaths: 0,
      characterDeaths: {},
    };
  }

  private async ensureOutputDir(): Promise<void> {
    await fs.mkdir(this.outputDir, { recursive: true });
  }

  private async saveStats(): Promise<void> {
    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.writeFile(this.statsFile, JSON.stringify(this.stats, null, 2));
    console.log("💾 Saved updated stats to disk");
  }

  private async updateStats(newDeath?: DeathEvent): Promise<void> {
    await this.ensureOutputDir();

    if (newDeath) {
      if (!this.stats.characterDeaths[newDeath.character]) {
        this.stats.characterDeaths[newDeath.character] = 0;
      }
      this.stats.totalDeaths++;
      this.stats.characterDeaths[newDeath.character]++;
      console.log(
        `💀 Death detected - ${newDeath.character} (${
          this.stats.characterDeaths[newDeath.character]
        } total deaths)`
      );
      await this.saveStats();
    }

    try {
      if (this.stats.totalDeaths > 0) {
        await fs.writeFile(
          path.join(this.outputDir, "total_deaths.txt"),
          this.stats.totalDeaths.toString()
        );

        for (const [character, deaths] of Object.entries(
          this.stats.characterDeaths
        )) {
          if (deaths > 0) {
            await fs.writeFile(
              path.join(this.outputDir, `${character}_deaths.txt`),
              deaths.toString()
            );
          }
        }

        if (this.deathEvents.length > 0) {
          const recentDeaths = this.deathEvents
            .map(
              (e) =>
                `${e.timestamp} - ${e.character} died (Total: ${
                  this.stats.characterDeaths[e.character]
                })`
            )
            .join("\n");
          await fs.writeFile(
            path.join(this.outputDir, "recent_deaths.txt"),
            recentDeaths
          );

          const lastFiveDeaths = this.deathEvents
            .slice(-5)
            .map(
              (e) =>
                `${e.timestamp} - ${e.character} (Total: ${
                  this.stats.characterDeaths[e.character]
                })`
            )
            .filter((line) => !line.includes("undefined"))
            .join("\n");

          if (lastFiveDeaths) {
            await fs.writeFile(
              path.join(this.outputDir, "last_five_deaths.txt"),
              lastFiveDeaths
            );
          }
        }

        console.log("📝 Updated all stat files");
      }
    } catch (error) {
      console.error("❌ Error updating stat files:", error);
    }
  }

  private parseDeathEvent(line: string): DeathEvent | null {
    const match = line.match(
      /(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}).*\[INFO Client.*\] : (.*) has been slain\./
    );
    if (!match) return null;
    return {
      timestamp: match[1],
      character: match[2],
    };
  }

  public async initialScan(): Promise<void> {
    console.log("🔍 Starting initial log scan...");
    const content = await fs.readFile(this.logPath, "utf-8");
    const lines = content.split("\n");
    let newDeaths = 0;

    for (const line of lines) {
      const event = this.parseDeathEvent(line);
      if (event) {
        this.deathEvents.push(event);
        // Initialize character deaths if not exists
        if (!this.stats.characterDeaths[event.character]) {
          this.stats.characterDeaths[event.character] = 0;
        }
        this.stats.totalDeaths++;
        this.stats.characterDeaths[event.character]++;
        newDeaths++;
      }
    }

    console.log(`✅ Initial scan complete. Found ${newDeaths} death events`);
    this.lastPosition = (await fs.stat(this.logPath)).size;

    // Save the stats after initial scan
    await this.saveStats();
    // Update all the files
    await this.updateStats();

    console.log("📊 Updated stats after initial scan:");
    console.log(`Total deaths: ${this.stats.totalDeaths}`);
    Object.entries(this.stats.characterDeaths).forEach(([char, deaths]) => {
      console.log(`  ${char}: ${deaths} deaths`);
    });
  }

  public async startTailing(): Promise<void> {
    await this.updateStats();
    console.log("👀 Starting to watch for new deaths...");
    console.log(`📊 Current total deaths: ${this.stats.totalDeaths}`);
    console.log("Character death counts:");
    Object.entries(this.stats.characterDeaths).forEach(([char, deaths]) => {
      console.log(`  ${char}: ${deaths} deaths`);
    });

    watch(this.logPath, async (eventType) => {
      if (eventType === "change") {
        try {
          const stat = await fs.stat(this.logPath);

          // Only process if file actually grew
          if (stat.size <= this.lastPosition) {
            return;
          }

          const handle = await fs.open(this.logPath, "r");
          const { buffer } = await handle.read({
            buffer: Buffer.alloc(stat.size - this.lastPosition),
            position: this.lastPosition,
          });
          await handle.close();

          const newContent = buffer.toString();
          const lines = newContent.split("\n");

          for (const line of lines) {
            // Skip empty lines
            if (!line.trim()) continue;

            const event = this.parseDeathEvent(line);
            if (event) {
              // Check if this event is already in our list
              const isDuplicate = this.deathEvents.some(
                (e) =>
                  e.timestamp === event.timestamp &&
                  e.character === event.character
              );

              if (!isDuplicate) {
                this.deathEvents.push(event);
                await this.updateStats(event);
              }
            }
          }

          this.lastPosition = stat.size;
        } catch (error) {
          console.error("❌ Error processing file change:", error);
        }
      }
    });

    console.log(`\n💡 Watching for deaths in: ${this.logPath}`);
    console.log(`💡 Stats are being saved to: ${this.outputDir}`);
  }
}

// Usage
async function main() {
  const tracker = new DeathTracker();
  console.log("Performing initial scan...");
  await tracker.initialScan();
  console.log("Starting file tail...");
  await tracker.startTailing();
}

main().catch(console.error);
