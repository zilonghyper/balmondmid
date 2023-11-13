namespace gdjs {
  export namespace evtTools {
    export namespace object {
      export namespace position {
        type SearchArea = {
          minX: float;
          minY: float;
          maxX: float;
          maxY: float;
        };
        // TODO Use a flag instead of this because an object can have no
        // instance picked because of a condition on a group.
        const isObjectsListsEmpty = (objectsLists: ObjectsLists) => {
          for (const objectName in objectsLists.items) {
            const objects = objectsLists.items[objectName];
            if (objects.length > 0) {
              return false;
            }
          }
          return true;
        };

        const searchArea = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        const nearbyObjects: Array<RuntimeObject> = [];

        export const twoListsSpacialCheck = (
          instanceContainer: RuntimeInstanceContainer,
          predicate: (
            object1: gdjs.RuntimeObject,
            object2: gdjs.RuntimeObject,
            extraArg: any
          ) => boolean,
          getSearchArea: (
            object: gdjs.RuntimeObject,
            searchArea: SearchArea,
            extraArg: any
          ) => SearchArea,
          objectsLists1: ObjectsLists,
          objectsLists2: ObjectsLists,
          inverted: boolean,
          predicateExtraArg?: any,
          areaExtraArg?: any
        ): boolean => {
          // Check if the list empty because it was not filtered yet.
          const isList1Empty = isObjectsListsEmpty(objectsLists1);
          const isList2Empty = isObjectsListsEmpty(objectsLists2);

          if (inverted || (!isList1Empty && !isList2Empty)) {
            // Both are already filtered fallback on the naïve check
            return gdjs.evtTools.object.twoListsTest(
              predicate,
              objectsLists1,
              objectsLists2,
              inverted,
              predicateExtraArg
            );
          }
          let isAnyObjectPicked = false;

          let iteratedLists = isList1Empty ? objectsLists2 : objectsLists1;
          let treeLists = isList1Empty ? objectsLists1 : objectsLists2;
          let isIteratedListsEmpty = isList1Empty ? isList2Empty : isList1Empty;

          let objectsMaxCount1 = 0;
          if (isList1Empty) {
            for (const objectName in objectsLists1.items) {
              const objectManager = instanceContainer.getObjectManager(
                objectName
              );
              objectsMaxCount1 = Math.max(
                objectsMaxCount1,
                objectManager.getAllInstances().length
              );
            }
          }
          let objectsMaxCount2 = 0;
          if (isList1Empty && isList2Empty) {
            for (const objectName in objectsLists2.items) {
              const objectManager = instanceContainer.getObjectManager(
                objectName
              );
              objectsMaxCount2 = Math.max(
                objectsMaxCount1,
                objectManager.getAllInstances().length
              );
            }
          }
          if (objectsMaxCount1 <= 8 && objectsMaxCount2 <= 8) {
            // Not enough instance for a R-Tree to be useful.
            return gdjs.evtTools.object.twoListsTest(
              predicate,
              objectsLists1,
              objectsLists2,
              inverted,
              predicateExtraArg
            );
          }
          if (isList1Empty && isList2Empty) {
            if (objectsMaxCount1 < objectsMaxCount2) {
              iteratedLists = objectsLists1;
              treeLists = objectsLists2;
            }
          }

          const pickingId = instanceContainer.getNewPickingId();
          for (const iteratedObjectName in iteratedLists.items) {
            const iteratedObjects = isIteratedListsEmpty
              ? instanceContainer.getInstancesOf(iteratedObjectName)
              : iteratedLists.items[iteratedObjectName];

            let isAnyIteratedObjectPicked = false;
            for (const objectName in treeLists.items) {
              const treeObjects = treeLists.items[objectName];
              const objectManager = instanceContainer.getObjectManager(
                objectName
              );
              for (const object of iteratedObjects) {
                nearbyObjects.length = 0;
                objectManager.search(
                  getSearchArea(object, searchArea, areaExtraArg),
                  nearbyObjects
                );
                for (const nearbyObject of nearbyObjects) {
                  if (predicate(object, nearbyObject, predicateExtraArg)) {
                    isAnyObjectPicked = true;
                    isAnyIteratedObjectPicked = true;
                    object.pickingId = pickingId;
                    if (nearbyObject.pickingId !== pickingId) {
                      treeObjects.push(nearbyObject);
                      nearbyObject.pickingId = pickingId;
                    }
                  }
                }
              }
            }
            if (isAnyIteratedObjectPicked) {
              gdjs.evtTools.object.filterPickedObjectsListWithId(
                iteratedObjects,
                pickingId
              );
            } else if (!isIteratedListsEmpty) {
              iteratedObjects.length = 0;
            }
          }

          return isAnyObjectPicked;
        };

        const getSearchAreaForDistanceCheck = (
          object: gdjs.RuntimeObject,
          searchArea: SearchArea,
          distance: float
        ): SearchArea => {
          const centerX = object.getX();
          const centerY = object.getY();
          searchArea.minX = centerX - distance;
          searchArea.maxX = centerX + distance;
          searchArea.minY = centerY - distance;
          searchArea.maxY = centerY + distance;
          return searchArea;
        };

        export const distanceCheck = (
          objectsLists1: ObjectsLists,
          objectsLists2: ObjectsLists,
          distance: float,
          inverted: boolean,
          instanceContainer: gdjs.RuntimeInstanceContainer
        ): boolean => {
          return twoListsSpacialCheck(
            instanceContainer,
            gdjs.evtTools.object._distanceBetweenObjects,
            getSearchAreaForDistanceCheck,
            objectsLists1,
            objectsLists2,
            inverted,
            distance * distance,
            distance
          );
        };

        const getSearchAreaForCollisionCheck = (
          object: gdjs.RuntimeObject,
          searchArea: SearchArea
        ): SearchArea => {
          const centerX = object.getCenterXInScene();
          const centerY = object.getCenterYInScene();
          const boundingRadius = Math.sqrt(object.getSqBoundingRadius());
          searchArea.minX = centerX - boundingRadius;
          searchArea.maxX = centerX + boundingRadius;
          searchArea.minY = centerY - boundingRadius;
          searchArea.maxY = centerY + boundingRadius;
          return searchArea;
        };

        export const hitBoxesCollisionCheck = (
          objectsLists1: ObjectsLists,
          objectsLists2: ObjectsLists,
          inverted: boolean,
          instanceContainer: gdjs.RuntimeInstanceContainer,
          ignoreTouchingEdges: boolean
        ): boolean => {
          return twoListsSpacialCheck(
            instanceContainer,
            gdjs.RuntimeObject.collisionTest,
            getSearchAreaForCollisionCheck,
            objectsLists1,
            objectsLists2,
            inverted,
            ignoreTouchingEdges
          );
        };
      }
    }
  }
}
