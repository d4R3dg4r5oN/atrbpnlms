// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('mm.core.user')

/**
 * Service to interact with plugins to be shown in user profile. Provides functions to register a plugin
 * and notify an update in the data.
 *
 * @module mm.core.user
 * @ngdoc service
 * @name $mmUserDelegate
 */
.factory('$mmUserDelegate', function($log) {

    $log = $log.getInstance('$mmUserDelegate');

    var plugins = {},
        self = {},
        data = {},
        controllers = [];

    /**
     * Register a plugin to show in the user profile.
     *
     * @module mm.core.user
     * @ngdoc method
     * @name $mmUserDelegate#registerPlugin
     * @param  {String}   name     Name of the plugin.
     * @param  {Function} callback Function to call to get the plugin data. This function should return an object with:
     *                                 -title: Plugin name to be displayed.
     *                                 -state: sref to the plugin's main state (i.e. site.grades).
     *                                 -stateParams: The parameter for the sref.
     *
     *                              The function received the user object as parameter.
     *                              If the plugin should not be shown (disabled, etc.) this function should return undefined.
     */
    self.registerPlugin = function(name, callback) {
        $log.debug("Register plugin '"+name+"' in participant.");
        plugins[name] = callback;
    };

    /**
     * Update the plugin data stored in the delegate.
     *
     * @module mm.core.user
     * @ngdoc method
     * @name $mmUserDelegate#updatePluginData
     * @param  {String}   name     Name of the plugin.
     * @param  {Object}   user     The user object.
     */
    self.updatePluginData = function(name, user) {
        $log.debug("Update plugin '"+name+"' data in participant.");
        var pluginData = plugins[name](user);
        if (typeof(pluginData) !== 'undefined') {
            data[name] = pluginData;
        } else {
            delete data[name];
        }
    };

    /**
     * Get the data of the registered plugins.
     *
     * @module mm.core.user
     * @ngdoc method
     * @name $mmUserDelegate#getData
     * @param {Object} user The user object.
     * @return {Object} Registered plugins data.
     */
    self.getData = function(user) {
        angular.forEach(plugins, function(callback, plugin) {
            self.updatePluginData(plugin, user);
        });
        return data;
    };

    return self;
});
