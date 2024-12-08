# Personal PoE2 Loot Filters

A collection of custom Path of Exile 2 item filters focused on efficient leveling and endgame item management.

## Features

- Gold stack highlighting with tiered visibility
- Currency management with emphasis on important drops
- Skill gem visibility rules
- Equipment highlighting based on item class
- Special highlighting for:
  - Rare items
  - Unique items
  - Runes
  - Quest items

## Filter Structure

- `basic-leveling.filter` - Core leveling filter with emphasis on:
  - Stack-based gold visibility
  - Essential currency items
  - Leveling gear progression
  - Quest items
  - Skill gems

## Installation

1. Clone this repository
2. Copy the desired `.filter` file to your PoE2 filter directory
3. Load the filter in-game through the UI settings

## Customization

Each filter section is clearly commented for easy modification:

- Gold rules: Stack-based visibility
- Base items: Normal/Magic/Rare rules
- Currency: Tiered visibility by type
- Skill Gems: Basic visibility rules
- Runes: High visibility settings
- Base Item Types: Equipment class rules
- Quest Items: High visibility settings

## Notes

- Filters are optimized for PoE2 beta
- Import functionality is not available in PoE2
- Some features may change as the game develops

## Development

### Recommended VS Code Extensions

For the best development experience, install these recommended extensions:

- [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight) - Visualize color codes in your filter
- [PoE Filter Language Support](https://marketplace.visualstudio.com/items?itemName=neversink.poe-filter-language) - Syntax highlighting and language support for Path of Exile item filters

These extensions are configured in the `.vscode/extensions.json` file and VS Code will automatically suggest installing them when you open the project.

## Contributing

Feel free to fork and modify these filters for your own use. Suggestions and improvements are welcome through issues and pull requests.

## License

Free to use and modify for personal use.
