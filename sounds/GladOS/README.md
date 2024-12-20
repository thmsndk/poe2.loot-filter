# GlaDOS Voice Lines for Path of Exile 2

Custom GlaDOS-style voice lines for Path of Exile 2 loot filter, generated using [GLaDOS Voice Generator](https://glados.c-net.org/).

## Sound Categories

- **Currency**: Sounds for currency items.
- **Quest Items**: Sounds for quest items.
- **Special Items**: Sounds for special items.
- **Jewel**: Sounds for jewel items.
- **Pinnacle**: Sounds for pinnacle items.
- **Waystone**: Sounds for waystone items.

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
