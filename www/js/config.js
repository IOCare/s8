angular.module('starter.config', [])
.constant('DB_CONFIG', {
    name: 'SWITCH8',
    tables: [
      {
            name: 'devices',
            columns: [
                {name: 'id', type: 'integer primary key'},
                {name: 'company', type: 'text'},
                {name: 'config', type: 'text'},
                {name: 'model', type: 'integer'},
                {name: 'type', type: 'text'},
                {name: 'url', type: 'text'},
                {name: 'roomid', type: 'text'}
            ]
        },
      {
            name: 'rooms',
            columns: [
                {name: 'id', type: 'integer primary key'},
                {name: 'type', type: 'text'},
                {name: 'name', type: 'text'},
                {name: 'icon', type: 'text'}
            ]
        }        
    ]
});