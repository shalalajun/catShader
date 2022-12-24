import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Cat
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
        this.resource = this.resources.items.foxModel
        this.catTex = this.resources.items.catTexture
        this.catTex.encoding = THREE.sRGBEncoding;
        // this.catTex = THREE.RepeatWrapping;
        // this.catTex = THREE.RepeatWrapping;
        this.catTex.flipY = false;
        this.catTex.needsUpdate = true;

        console.log(this.catTex)

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(10, 10, 10)
        this.model.position.set(0,-2,0)
        this.scene.add(this.model)
        this.catMap = new THREE.MeshStandardMaterial({
            map:this.catTex,
            roughness: 0.46,
            //metalness: 0.1
        })

        this.catMap.onBeforeCompile = (shader) => {


            shader.vertexShader = shader.vertexShader.replace(
                
                "#define STANDARD",
                `
                #define STANDARD
                varying vec3 wPosition;
                `
            )

            shader.vertexShader = shader.vertexShader.replace(
                
                "#include <clipping_planes_vertex> STANDARD",
                `
                #include <clipping_planes_vertex> STANDARD
                wPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                `
            )





            


            shader.fragmentShader = shader.fragmentShader.replace(
                
                "#include <output_fragment>",
                `
                #include <output_fragment>
                vec3 fCol = vec3(1.0,0.0,0.0);
                gl_FragColor = vec4( outgoingLight, diffuseColor.a );
                `
            )

        }

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.material = this.catMap
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        // this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        // this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
        
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}