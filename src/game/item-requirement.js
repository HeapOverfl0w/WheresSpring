export class ItemRequirement {
    constructor(itemNames, dialogText, returnItem = undefined, animationChange = undefined) {
        this.itemNames = itemNames;
        this.dialogText = dialogText;
        this.returnItem = returnItem;
        this.animationChange = animationChange;
    }
}