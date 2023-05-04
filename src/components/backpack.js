import { List, ListItemButton, ListItemText, Tooltip } from "@mui/material";
import React from "react";

export function Backpack(props) {

    return (
        <div>
            { props.backpackOpen ?
                <div
                    style={{
                        position:'absolute', 
                        bottom: '15vh',
                        right: '30px',
                        width: '20vw',
                        height: '80vh',
                        backgroundImage: 'url("./rsc/backpackBackdrop.png")',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize:'100% 100%',
                        padding: '30px'
                    }}
                >
                    <List style={{maxHeight: '80vh', minWidth: '100%', overflow: 'auto'}}>
                        { props.inventory.map((value) => (
                            <Tooltip title={value.desc}>
                                <ListItemButton style={{padding: '10px'}}>
                                    <img src={`./rsc/${value.imageName}`} style={{width: '30px', height: '30px', marginRight: '5px'}} />
                                    <ListItemText primary={value.name} />
                                </ListItemButton>
                            </Tooltip>
                        ))}
                    </List>
                </div> : null
            }
        </div>
    );
}