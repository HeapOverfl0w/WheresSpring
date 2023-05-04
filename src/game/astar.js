function getChildrenTiles (position) {
    return [
        {x: position.x, y: position.y-1}, 
        {x: position.x-1, y: position.y}, 
        {x: position.x+1, y: position.y}, 
        {x: position.x, y: position.y+1}, 
        {x: position.x+1, y: position.y+1}, 
        {x: position.x-1, y: position.y-1},
        {x: position.x-1, y: position.y+1},
        {x: position.x+1, y: position.y-1}
    ]
}

export function aStar(start, end, map, checkForActors = true) {
    start.g = 0;
    start.h = 0;
    start.f = 0;
    start.parent = undefined;
    end.g = 0;
    end.h = 0;
    end.f = 0;

    let openList = [];
    let closedList = [];
    openList.push(start);
    //loop till we find the end
    while (openList.length > 0) {
        //get current node
        let currentNode = openList[0];
        let currentIndex = 0;
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].f < currentNode.f) {
                currentNode = openList[i];
                currentIndex = i;
            }
        }
        //pop off current open list add to the closed list
        openList.splice(currentIndex, 1);
        closedList.push(currentNode);

        //found the goal
        if (end.x === currentNode.x && end.y === currentNode.y) {
            let path = [];
            let current = currentNode;
            while (current) {
                path.unshift(current);
                current = current.parent;
            }
            path.shift();
            return path;
        }

        //generate children
        let children = getChildrenTiles(currentNode);
        //loop through children
        for(let i = 0; i < children.length; i++) {
            let child = children[i];
            //set parent
            child.parent = currentNode;

            //child is wall or out of bounds
            if (child.x < 0 || child.x >= map.length ||
                child.y < 0 || child.y >= map[0].length ||
                !map[child.x][child.y] || !map[child.x][child.y].passable || (checkForActors && map[child.x][child.y].actor)) {
                continue;
            }

            //child is not in closed list
            if (closedList.some((closed) => closed.x === child.x && closed.y === child.y)) {
                continue;
            }

            //create the f, g, and h values
            child.g = currentNode.g + 1;
            child.h = Math.sqrt(Math.pow(child.x - end.x, 2) + Math.pow(child.y - end.y, 2));
            child.f = child.g + child.h;

            //child is already in the open list
            if (openList.some((opened) => opened.x === child.x && opened.y === child.y)) {
                continue;
            }

            //add to open list
            openList.push(child);
        }
    }
}