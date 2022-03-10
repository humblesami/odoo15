odoo.define('pos_customer_fields',function(require) {
    "use strict";
    var models = require('point_of_sale.models');
    var screens = require('point_of_sale.screens');
    var pos_model_super = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        initialize: function(session, attributes){
            let self = this;
            for(let model_obj of self.models){
                if(model_obj.model == 'res.partner'){
                    model_obj.fields.push('vehicle_number');
                }
            }
            return pos_model_super.initialize.apply(self, arguments);
        },
        load_server_data: function(){
            var self = this;
            return pos_model_super.load_server_data.apply(this, arguments);
        },
    });

    // not working
//    var posDB = require('point_of_sale.DB');
//    var posDBSearch =  posDB.extend({
//        _partner_search_string: function(partner){
//            console.log('partner search');
//            this._super();
//        }
//    });
//    return posDBSearch;
//    var ClientListScreenWidget = screens.ClientListScreenWidget.extend({
//        save_client_details: function(partner){
//            console.log('client saved');
//            this._super();
//        }
//    });
});