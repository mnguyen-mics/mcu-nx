define(['./module'], function (module) {
    'use strict';

    module.factory("core/datamart/queries/QueryContainer", [
        'Restangular', '$q', 'lodash', 'core/common/auth/Session', "async", 'core/common/promiseUtils', '$log',

        function (Restangular, $q, lodash, Session, async, promiseUtils, $log) {

            var ElementContainer = function ElementContainer(value) {
                if (value) {
                    this.value = value;
                    this.id = value.id;
                }

                this.conditions = [];
                this.removedConditions = [];

            };

            ElementContainer.prototype.getName = function () {
                if (this.conditions[0].property_selector_family === 'EVENTS'){
                    return this.conditions[0].property_selector_family_parameter;
                }else{
                    return this.conditions[0].property_selector_family;
                }
            };

            ElementContainer.prototype.createCondition = function (propertySelector) {

                var condition = {
                    property_selector_family: propertySelector.selector_family,
                    property_selector_id: propertySelector.id,
                    property_selector_name: propertySelector.selector_name,
                    property_selector_family_parameter: propertySelector.family_parameters,
                    property_selector_parameters: propertySelector.selector_parameters,
                    property_selector_value_type: propertySelector.value_type
                };

                this.conditions.push(condition);
            };

            ElementContainer.prototype.removeCondition = function (condition) {
                if (condition.id) {
                    this.removedConditions.push(condition);
                }
                var i = this.conditions.indexOf(condition);
                this.conditions.splice(i, 1);
            };

            ElementContainer.prototype.buildInfoResource = function () {
                return {conditions:Restangular.stripRestangular(this.conditions)};
            };

            /*ElementContainer.prototype.loadConditions = function () {
                var self = this;
                return this.value.all('conditions').getList().then(function (conditions) {
                    self.conditions = conditions;
                    return self.conditions;
                });
            };*/

            var GroupContainer = function GroupContainer(queryContainer, value) {
                if (value) {
                    this.value = value;
                    this.id = value.id;
                } else {
                    this.value = {excluded: false};
                }

                this.queryContainer = queryContainer;

                this.elementContainers = [];
                this.removedElementContainers = [];
            };

            GroupContainer.prototype.toggleExclude = function () {
                this.value.excluded = !this.value.excluded;
            };

           /* GroupContainer.prototype.loadElements = function () {
                var self = this;
                return this.value.all('elements').getList().then(function (elements) {
                    return lodash.map(elements, function(element){
                        var elementContainer = new ElementContainer(element)
                        var conditionsP = elementContainer.loadConditions();
                        self.elementContainers.push(elementContainer);

                        return $q.all(conditionsP).then(function () {
                            return self;
                        });
                    });

                });
            };*/

            GroupContainer.prototype.removeElementContainer = function (element) {
                if (element.id) {
                    this.removedElementContainers.push(element);
                }
                var i = this.elementContainers.indexOf(element);
                this.elementContainers.splice(i, 1);
            };

            GroupContainer.prototype.createElementWithCondition = function (propertySelector) {

                var condition = {
                    property_selector_family: propertySelector.selector_family,
                    property_selector_id: propertySelector.id,
                    property_selector_name: propertySelector.selector_name,
                    property_selector_family_parameter: propertySelector.family_parameters,
                    property_selector_parameters: propertySelector.selector_parameters,
                    property_selector_value_type: propertySelector.value_type
                };

                var elementContainer = new ElementContainer();
                elementContainer.conditions.push(condition);

                this.elementContainers.push(elementContainer);
            };

            /*var conditionIsAbsent = function (conditions, condition) {
                var found = lodash.find(conditions, function (cond) {
                    return cond.property_selector_id === condition.property_selector_id;
                });
                return !found;
            };*/

            /*GroupContainer.prototype.saveTasks = function () {
                var addConditions = lodash.filter(this.conditions, function (condition) {
                    return !condition.id;
                });

                var updateConditions = lodash.filter(this.conditions, function (condition) {
                    return condition.id;
                });

                var self = this;
                var pAddConditionTasks = lodash.map(addConditions, function (condition) {
                    return GroupContainer.addConditionTask(self, condition);
                });

                var pUpdateConditionTasks = lodash.map(updateConditions, function (condition) {
                    return GroupContainer.updateConditionTask(condition);
                });

                var pDeleteConditionTasks = lodash.map(this.removedConditions, function (condition) {
                    return GroupContainer.deleteConditionTask(condition);
                });

                var pList = [];
                pList = pList.concat(pDeleteConditionTasks);
                pList = pList.concat(pUpdateConditionTasks);
                pList = pList.concat(pAddConditionTasks);

                return pList;
            };*/

           /* GroupContainer.updateConditionTask = function (condition) {
                return function (callback) {
                    $log.info("update condition : ", condition.id);
                    var promise = condition.put();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            GroupContainer.addConditionTask = function (conditionGroupContainer, condition) {
                return function (callback) {
                    $log.info("saving condition on groupId : " + conditionGroupContainer.id + ', ', condition);
                    var conditionsEndpoint;
                    if (conditionGroupContainer.conditions.length === 0) {
                        var datamartId = conditionGroupContainer.queryContainer.datamartId;
                        var queryId = conditionGroupContainer.queryContainer.id;
                        var groupId = conditionGroupContainer.id;
                        conditionsEndpoint = Restangular.one('datamarts', datamartId).one('queries', queryId).one('condition_groups', groupId).all('conditions');
                    } else {
                        conditionsEndpoint = conditionGroupContainer.conditions;
                    }
                    var promise = conditionsEndpoint.post(condition);
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            GroupContainer.deleteConditionTask = function (condition) {
                return function (callback) {
                    $log.info("delete condition : ", condition.id);
                    var promise = condition.remove();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };*/

            GroupContainer.prototype.buildInfoResource = function () {
                var _elements = lodash.map(this.elementContainers, function(elementContainer){
                    return elementContainer.buildInfoResource();
                });
                return {
                    excluded:this.value.excluded,
                    elements:_elements
                };
            };


            var QueryContainer = function QueryContainer(value) {
                if (value){
                    this.value = value;
                    this.datamartId = value.datamart_id;
                    this.id = value.id;
                }

                this.groupContainers = [];
                this.removedGroupContainers = [];
            };

            /*QueryContainer.load = function (datamartId, queryId) {

                var queryEndpoint = Restangular.one('datamarts', datamartId).one('queries', queryId);

                var pQuery = queryEndpoint.get();
                var pGroups = queryEndpoint.all('groups').getList();

                return $q.all([pQuery, pGroups]).then(function (result) {
                    //query
                    var queryContainer = new QueryContainer(result[0]);
                    //conditionGroups
                    queryContainer.groupContainers = lodash.sortBy(result[1], function (group) {
                        return group.id;
                    }).map(function (group) {
                        return new GroupContainer(queryContainer, group);
                    });

                    var elementsP = lodash.map(queryContainer.groupContainers, function (groupContainer) {
                        return groupContainer.loadElements();
                    });

                    return $q.all(elementsP).then(function () {
                        return queryContainer;
                    });

                });
            };*/

            QueryContainer.prototype.addGroupContainer = function () {
                this.groupContainers.push(new GroupContainer(this));
            };

            QueryContainer.prototype.removeGroupContainer = function (groupContainer) {
                if (groupContainer.id) {
                    this.removedGroupContainers.push(groupContainer);
                }
                var i = this.groupContainers.indexOf(groupContainer);
                this.groupContainers.splice(i, 1);
            };

           /* QueryContainer.prototype.save = function () {
                var addGroupContainers = lodash.filter(this.groupContainers, function (groupContainer) {
                    return !groupContainer.id;
                });

                var updateGroupContainers = lodash.filter(this.groupContainers, function (groupContainer) {
                    return groupContainer.id;
                });

                var pAddConditionGroupTasks = lodash.map(addGroupContainers, function (groupContainer) {
                    return QueryContainer.addConditionGroupTask(groupContainer);
                });

                var pUpdateConditionGroupTasks = lodash.map(updateGroupContainers, function (groupContainer) {
                    return QueryContainer.updateConditionGroupTask(groupContainer);
                });

                var pDeleteConditionGroupTasks = lodash.map(this.removedGroupContainers, function (groupContainer) {
                    return QueryContainer.deleteConditionGroupTask(groupContainer);
                });

                var pConditionTasks = lodash.flatten(lodash.map(updateGroupContainers, function (groupContainer) {
                    return groupContainer.saveTasks();
                }));

                var pList = [];
                pList = pList.concat(pAddConditionGroupTasks);
                pList = pList.concat(pDeleteConditionGroupTasks);
                pList = pList.concat(pUpdateConditionGroupTasks);
                pList = pList.concat(pConditionTasks);

                return async.series(pList);
            };

            QueryContainer.addConditionGroupTask = function (conditionGroupContainer) {
                return function (callback) {
                    $log.info("saving condition group : ", conditionGroupContainer.value);

                    var deferred = $q.defer();
                    var promise = deferred.promise;

                    var datamartId = conditionGroupContainer.queryContainer.datamartId;
                    var queryId = conditionGroupContainer.queryContainer.id;

                    var queryEndpoint = Restangular.one('datamarts', datamartId).one('queries', queryId);
                    var pConditionGroup = queryEndpoint.all('condition_groups').post(conditionGroupContainer.value);

                    pConditionGroup.then(function (savedGroup) {
                        var pConditions = lodash.map(conditionGroupContainer.conditions, function (condition) {
                            return GroupContainer.addConditionTask(new GroupContainer(conditionGroupContainer.queryContainer, savedGroup), condition);
                        });
                        async.series(pConditions, function (err, res) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(savedGroup);
                            }
                        });

                    });

                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            QueryContainer.updateConditionGroupTask = function (conditionGroupContainer) {
                return function (callback) {
                    $log.info("update condition group : ", conditionGroupContainer.id);
                    var promise = conditionGroupContainer.value.put();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            QueryContainer.deleteConditionGroupTask = function (conditionGroupContainer) {
                return function (callback) {
                    $log.info("delete condition group : ", conditionGroupContainer.id);
                    var promise = conditionGroupContainer.value.remove();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };*/

            QueryContainer.prototype.prepareJsonQuery = function (datamartId) {
                var _groups = lodash.map(this.groupContainers, function(groupContainer){
                    return groupContainer.buildInfoResource();
                });
                return {
                  /*id:this.id,*/
                  datamart_id:datamartId,
                  groups:_groups
                };
            };

            return QueryContainer;
        }

    ]);
});
