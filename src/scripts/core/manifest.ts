// single source of truth for assets used in the build
export const Manifest = 
{
    //branding and backdrop
    background:new URL("../../assets/baseScene/background.png",import.meta.url).href,
    ground:new URL("../../assets/baseScene/ground.png",import.meta.url).href,
    horizon:new URL("../../assets/baseScene/horizonHighlight.png",import.meta.url).href,
    logo:new URL("../../assets/Branding/logo2.png",import.meta.url).href,
    dunesRight:new URL("../../assets/baseScene/dunesRight.png",import.meta.url).href,
    rock:new URL("../../assets/baseScene/Rock.png",import.meta.url).href,
    blueCoral:new URL("../../assets/baseScene/BlueCoral.png",import.meta.url).href,

    //aquarium layered assets
    shellBack: new URL("../../assets/Aquarium/backing.png",import.meta.url).href,
    tankBack: new URL("../../assets/Aquarium/tankBacking.png",import.meta.url).href,
    tank: new URL("../../assets/Aquarium/tank.png",import.meta.url).href,
    tankContent: new URL("../../assets/Aquarium/tankContent.png",import.meta.url).href,
    dial: new URL("../../assets/Aquarium/dial.png",import.meta.url).href,
    screen: new URL("../../assets/Aquarium/screen.png",import.meta.url).href,

    //characters
    characterHighlight:new URL("../../assets/CharacterScreen/CharacterHighlight.png",import.meta.url).href,
    turtleBasic:new URL("../../assets/CharacterScreen/turtle_basic.png",import.meta.url).href,
    turtleBasicMask:new URL("../../assets/CharacterScreen/turtle_basic_mask.png",import.meta.url).href,
    turtleEvolved:new URL("../../assets/CharacterScreen/turtle_evolved.png",import.meta.url).href,
    turtleEvolvedMask:new URL("../../assets/CharacterScreen/turtle_evolved_mask.png",import.meta.url).href,
    dogBasic:new URL("../../assets/CharacterScreen/dog_basic.png",import.meta.url).href,
    mantaBasic:new URL("../../assets/CharacterScreen/manta_basic.png",import.meta.url).href,
    mermaidBasic:new URL("../../assets/CharacterScreen/shark_Basic.png",import.meta.url).href,
    sharkBasic:new URL("../../assets/CharacterScreen/mermaid_Basic.png",import.meta.url).href,
    lock:new URL("../../assets/CharacterScreen/lock.png",import.meta.url).href,

    //colour Select

    //heart UI
    heart: new URL("../../assets/UI/heartOutline.png",import.meta.url).href,
    heartFill: new URL("../../assets/UI/heartFill.png",import.meta.url).href,
    //evolution
    firework:new URL('../../assets/evolution/sparkles.png',import.meta.url).href,
    perlinMap:new URL('../../assets/evolution/perlin.png',import.meta.url).href,
    sparkle:new URL('../../assets/evolution/sparkles_2.png',import.meta.url).href,
    //bubble game
    bubble: new URL("../../assets/bubbleGame/bubbles.png",import.meta.url).href,
    bubblePop: new URL("../../assets/bubbleGame/bubblePop.png",import.meta.url).href,
    //Evolution Screen
    //End Screen
    button: new URL("../../assets/UI/button.png",import.meta.url).href
}

// all audio was converted to mono
export const AudioManifest = 
{
    //Sourced from Pixabay, audio by Artem Hramushkin
    BGM:new URL("../../assets/audio/BGMusic.mp3",import.meta.url).href,
    //Sourced from Pixabay, audio by universefield
    bubble:new URL("../../assets/audio/bubblePopAudio.mp3",import.meta.url).href,
    //Sourced from Pixabay, audio by freesoundeffects
    button:new URL("../../assets/audio/buttonClick.mp3",import.meta.url).href,
    //sourced from Pixabay, audio by Humordome
    sparkleTone:new URL("../../assets/audio/sparkle.mp3",import.meta.url).href,
    //Sourced from Pixabay, audio by universefield
    FireworkTone:new URL("../../assets/audio/fireworkMoment.mp3",import.meta.url).href,
}


export type AssetAlias = keyof typeof Manifest;
export type AudioAlias = keyof typeof AudioManifest;