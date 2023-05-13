import React, {useRef, useEffect, useState} from "react";
import { Main } from '../game/main';
import { Dialog } from "./dialog";
import { Backpack } from "./backpack";
import { GLOBAL_AUDIO_HANDLER } from "../game/audio-handler";
import { Application } from 'pixi.js';

export function Scene() {
    const canvasRef = useRef();
    const [main, setMain] = useState(undefined);
    const [backpackOpen, setBackpackOpen] = useState(false);
    const [inventory, setInventory] = useState([]);
    const [dialogText, setDialogText] = useState('');
    const [dialogImage, setDialogImage] = useState('');

    let mainCreated = false;
    let useEffectCalled = false;

    useEffect(() => {
        if (!useEffectCalled) {
            const webglApp = new Application({width: 500, height: 350, background: '#48657D', view: canvasRef.current});
            if (!mainCreated) {
                let newMain = new Main(webglApp);
                setMain(newMain);

                newMain.load(() => {}).then(() => {
                    setInventory(newMain.player.inventory);
                    mainCreated = true;
                });
            }

            useEffectCalled = true;
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
                <canvas style={{minWidth: '100vw', maxHeight: '100vh'}}
                    id='scene' ref={canvasRef}
                    width='560' height='350'
                    onWheel={(event) => {
                        main?.handleMouseWheel(event.deltaY);
                    }}
                    onMouseMove={(event) => {
                        let rect = canvasRef.current.getBoundingClientRect();
                        let x = event.clientX - rect.left;
                        let y = event.clientY - rect.top;
                        main?.handleMouseMove(
                            x / canvasRef.current.clientWidth * canvasRef.current.width, 
                            y / canvasRef.current.clientHeight* canvasRef.current.height);
                    }}
                    onMouseUp={() => {
                        if (!dialogText) {
                            main?.handleMouseUp();
                        } 
                    }}
                ></canvas> 
                <Dialog dialogText={dialogText} dialogImage={dialogImage} />
                <Backpack backpackOpen={backpackOpen} inventory={inventory}/>
            </div>
        </div>
    )
}