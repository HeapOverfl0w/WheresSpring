import React, {useRef, useEffect, useState} from "react";
import { Data } from '../game/data';
import { Main } from '../game/main';
import { Dialog } from "./dialog";
import { Backpack } from "./backpack";

export function Scene() {
    const canvasRef = useRef();
    const [data, setData] = useState(undefined);
    const [main, setMain] = useState(undefined);
    const [backpackOpen, setBackpackOpen] = useState(false);
    const [inventory, setInventory] = useState([]);
    const [dialogText, setDialogText] = useState("");
    const [dialogImage, setDialogImage] = useState("");

    let mainCreated = false;

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        if (!mainCreated) {
            let newData = new Data();
            newData.load();
            let newMain = new Main(ctx, newData);
            newMain.start();
            setData(newData);
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
                if (!dialogText) {
                    const returnValue = main?.handleKeyUp(event.key);
                    if (returnValue) {
                        setDialogImage(returnValue.dialogImage);
                        setDialogText(returnValue.dialogText);
                    }
                } else {
                    if (event.key === 'e') {
                        setDialogText("");
                    }
                }
                //open/close backpack
                if (event.key === "b" && !dialogText && main) {
                    setBackpackOpen(!backpackOpen);
                    setInventory(main.player.inventory);
                }
            }}
        >
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <canvas style={{minWidth: '100vw', maxHeight: '100vh'}}
                    id='scene' ref={canvasRef}
                    width='640' height='400'
                    onWheel={(event) => {
                        main?.handleMouseWheel(event.deltaY);
                    }}
                    onMouseMove={(event) => {
                        let rect = canvasRef.current.getBoundingClientRect();
                        let x = event.clientX - rect.left;
                        let y = event.clientY - rect.top;
                        main?.handleMouseMove(
                            x / canvasRef.current.clientWidth * canvasRef.current.width, 
                            y / canvasRef.current.clientHeight * canvasRef.current.height);
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