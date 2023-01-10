import React from "react"
import classes from './Spinner.module.css'

const spinner = () => (
    <div className={classes.Spinner}>
    <div className={classes.rect1}></div>
    <div className={classes.rect2}></div>
    <div className={classes.rect3}></div>
    <div className={classes.rect4}></div>
    <div className={classes.rect5}></div>
</div>

)


export default spinner