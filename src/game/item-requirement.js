export class ItemRequirement {
    constructor(itemNames, dialogText, returnItem = undefined, animationChange = undefined, dialogChange = undefined, nameChange = undefined) {
        this.itemNames = itemNames;
        this.dialogText = dialogText;
        this.returnItem = returnItem;
        this.animationChange = animationChange;
        this.dialogChange = dialogChange;
        this.nameChange = nameChange;
    }
}