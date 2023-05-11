import React, {useRef, useEffect, useState} from "react";
import { Main } from '../game/main';
import { Dialog } from "./dialog";
import { Backpack } from "./backpack";
import { GLOBAL_AUDIO_HANDLER } from "../game/audio-handler";
import { Application } from 'pixi.js';

export function Scene() {
    const pixiDivRef = useRef();
    const [main, setMain] = useState(undefined);
    const [backpackOpen, setBackpackOpen] = useState(false);
    const [inventory, setInventory] = useState([]);
    const [dialogText, setDialogText] = useState('');
    const [dialogImage, setDialogImage] = useState('');

    let mainCreated = false;

    useEffect(() => {
        const webglApp = new Application({width: 500, height: 350, background: '#48657D'});
        pixiDivRef.current.appendChild(webglApp.view);
        if (!mainCreated) {
            let newMain = new Main(webglApp);
            setMain(newMain);
            setInventory(newMain.player.inventory);
            mainCreated = true;
        }
    }, []);

    return (
        <div tabIndex="0"
            onKeyDown={(event) => {
                if (!backpackOpen && !dialogText) {
                    main?.handleKeyDown(event.key);
                }
            }}
            onKeyUp={(event) => {
                if (event.key === 'q') {
                    GLOBAL_AUDIO_HANDLER.toggleMute();
                    return;
                }

                if (!dialogText) {
                    const returnValue = main?.handleKeyUp(event.key);
                    if (returnValue) {
                        setDialogImage(returnValue.dialogImage);
                        setDialogText(returnValue.dialogText);
                    }
                } else {
                    if (event.key === 'e') {
                        if (dialogText.startsWith("Spring")) {
                            main.activeCutscene = main.data.springCutscene;
                        }
                        GLOBAL_AUDIO_HANDLER.playClick();
                        setDialogText("");
                    }
                }
                //open/close backpack
                if (event.key === "b" && !dialogText && main) {
                    GLOBAL_AUDIO_HANDLER.playBackpack();
                    setBackpackOpen(!backpackOpen);
                    setInventory(main.player.inventory);
                }
            }}
        >
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div id='hardwareScene' ref={pixiDivRef}></div>
                <Dialog dialogText={dialogText} dialogImage={dialogImage} />
                <Backpack backpackOpen={backpackOpen} inventory={inventory}/>
            </div>
        </div>
    )
}