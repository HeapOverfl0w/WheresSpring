import React from "react";
import { Typography } from "@mui/material";

export function Dialog(props) {

    return (
        <div>
        { props.dialogText && props.dialogImage ? 
            <div
                style={{
                    position:'absolute', 
                    bottom: '30px',
                    left: '10vw',
                    width: '80vw',
                    height: '40vh',
                    backgroundImage: `url("./rsc/${props.dialogImage}")`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize:'100% 100%',
                    padding: '50px'
                }}
            >
                <Typography style={{
                    marginLeft: '25vw'
                }}>
                    { props.dialogText }
                </Typography>
            </div> : 
            null
        }
        </div>
    )
}