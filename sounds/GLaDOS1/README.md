# GlaDOS Voice Lines for Path of Exile 2

Custom GlaDOS-style voice lines for Path of Exile 2 loot filter, generated using [GLaDOS Voice Generator](https://glados.c-net.org/).

## Sound Categories

- **Currency**: Sounds for currency items.
- **Quest Items**: Sounds for quest items.
- **Special Items**: Sounds for special items.
- **Jewel**: Sounds for jewel items.
- **Pinnacle**: Sounds for pinnacle items.
- **Waystone**: Sounds for waystone items.
- **Uniques**: Sounds for unique items of varying tiers.

## Unique Sound Variations

### Tier 1 Expensive and Lucky (High Value)

- Unique detected. How remarkably valuable.
- "Unique detected. How wonderfully expensive."
- "Valuable unique found. Try not to ruin this one."
- "Premium unique acquired. I'm almost impressed."

### Tier 2 Fairly Expensive (Roll Dependent, High Potential)

- Unique acquired. The rolls might matter.
- "Unique detected. Potentially worthwhile."
- "Unique found. The rolls will determine your fate."
- "Notable unique spotted. Let's see if you got lucky."

### Tier 3 (Roll Dependent)

- Unique found. Do check those rolls.
- "Unique detected. Check rolls before excitement."
- "Unique found. Results may disappoint."
- "Unique spotted. Probability suggests mediocrity."

### Early League

- Unique dropped. Temporarily interesting.
- "Unique found. Temporarily relevant."
- "Unique detected. Enjoy it while it lasts."
- "Unique acquired. Time is not on your side."

### Multi Special High

- Unique base detected. Could be valuable. Could be trash.
- "Unique base found. The suspense is killing me."
- "Unique base detected. Probability favors disappointment."
- "Unique base spotted. Let's solve this mystery."

### Multi Special

- Unique base found. You might want to verify this one.
- "Unique base found. Verification advised."
- "Unique base detected. Don't jump to conclusions."
- "Unique base acquired. Results may vary wildly."

### Tier 3 Boss

- Unique base spotted. Boss variants exist. How thrilling.
- "Unique base found. Check boss variants."
- "Unique base detected. Boss versions exist."
- "Unique base spotted. Could be special. Probably isn't."

## Sound Generation

Sounds are generated using curl commands to the GLaDOS Voice Generator:

```bash
curl -L --retry 30 --get --fail \
--data-urlencode "text=YOUR_TEXT_HERE" \
-o "sounds/GladOS/SOUND_NAME.wav" \
"https://glados.c-net.org/generate"
```

## Credits

- Voice generation provided by [GLaDOS Voice Generator](https://glados.c-net.org/)

## License

Generated voice samples are licensed under WTFPL as per GLaDOS Voice Generator terms.
