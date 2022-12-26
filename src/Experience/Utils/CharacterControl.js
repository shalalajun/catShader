
import * as THREE from 'three'
import EventEmitter from "./EventEmitter";
import Experience from '../Experience'

export default class CharacterControl 
{
    constructor()
    {
       

        this.experience = new Experience()
        this.raycaster = new THREE.Raycaster()
        this.camera = this.experience.camera
        this.renderer = this.experience.renderer
        this.pointer = new THREE.Vector2()
        
        window.addEventListener("click", ()=>
        {
            console.log("click")
            this.onClick()
            //this.trigger('click')
        }, false);
        
        

    }

    onClick(event)
    {
        this.pointer.x = (window.event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(window.event.clientY / window.innerHeight) * 2 + 1;
    }

    // update()
    // {
    //     this.camPos = this.camera.instance.clone()
    //     this.raycaster.setFromCamera(new THREE.Vector2(this.pointer.x, this.pointer.y), this.camPos)
    // }
}