import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Cat from './Cat.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.cat = new Cat()
            this.environment = new Environment()
        })
    }

    update()
    {
        if(this.cat)
            this.cat.update()
    }
}