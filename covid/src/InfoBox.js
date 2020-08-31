import React from 'react';
import  './InfoBox.css';
import {Card, CardContent, Typography} from '@material-ui/core';

//what we are passing i.e title, cases and total are called props
function InfoBox({title, cases, active, total, isRed, ...props}){

    return(
     /*since we are using InfoBox which is material-ui, we cannot define
     methods like onClic directly. By spreading it as a props i.e ...props, we are able
     to use the onclick and call it as below by onClick={props.onClick} */

     /* The ${active && "infoBox--selected"} ${
            isRed && "infoBox--red" checks if is active and applies the infoBox--selected class to it
            it also checks if isred and applies infoBox--red class */
        <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${
            isRed && "infoBox--red"
          }`}> 
            <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>

        </Card>
    )
}

export default InfoBox;