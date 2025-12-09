import { GridSettings } from './GridSettings.js';
import { TargetSettings } from './TargetSettings.js';

export class Settings {
    constructor() {
        this.gridSettings = new GridSettings();
        this.targetSettings = new TargetSettings();
    }
}
