odoo.define('inline_customer_pos.InlineCustomerWidget', function(require) {
    'use strict';

    var models = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');

    var pos_model_super = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        after_load_server_data: function(){
            var self = this;
            return pos_model_super.after_load_server_data.apply(this, arguments).then(function(){
                set_display_text(self.partners, ['name', 'phone', 'mobile']);
            });
        },
    });

    var ActionpadWidget = require('point_of_sale.ActionpadWidget');
    const ActionWidgetCustomer = (ActionpadWidget) => class extends ActionpadWidget{
        constructor() {
            super(...arguments);
            let self = this;
            setTimeout(function(){
                load_partners_drop_down(self.env.pos);
            }, 100);
        }
    };
    Registries.Component.extend(ActionpadWidget, ActionWidgetCustomer);

    //Odoo code finished following is custom javascript functions code

    var show_all_search_fields_in_text = true;
    function load_partners_drop_down(pos_model){
        let input_found = $(".search_customers").length;
        if(!input_found){
            console.log('Customers dropdown can not be loaded yet');
            return;
        }
        if($('.select2-container.search_customers').length){
            console.log('Partner list already loaded');
            return;
        }
        let partners_array = pos_model.partners;
        if(!partners_array.length){
            console.log('No customers available to be listed yet');
            return;
        }

        $(".search_customers").show().empty();

        let customer_selected_on_list_load = 1;
        $(".search_customers").select2({
            placeholder: 'Select an option',
            data: partners_array,
            allowClear: true,
            width: 180,
            matcher: matcher_function
        }).change(function(){
            if(customer_selected_on_list_load){
                customer_selected_on_list_load = 0;
                return;
            }
            let selected_customer = $(".search_customers").select2('data');
            pos_model.get_order().set_client(selected_customer);
        });
        $('.select2-focusser.select2-offscreen').hide();

        let current_customer = pos_model.get_order().get_client();
        if(current_customer)
        {
            //customer_selected_on_list_load
            $(".search_customers").val(current_customer.id).change();
        }
        customer_selected_on_list_load = 0;
    }

    function matcher_function(term, text, option) {
        if(search_fields && Array.isArray(search_fields) && search_fields.length){
            for(let field of search_fields){
                let res = option[field].toUpperCase().indexOf(term.toUpperCase()) > -1;
                if(res){
                    return res;
                    //other wise keep looking into next fields
                }
            }
        }
        else{
            return text.toUpperCase().indexOf(term.toUpperCase()) > -1;
        }
    }

    function set_display_text(partners_array, search_fields){
        for(let item of partners_array){
            item.text = '';
            if(show_all_search_fields_in_text){
                for(let field of search_fields){
                    if(item.text)
                    {
                        if(item[field])
                        {
                            item.text += ' - ' + item[field];
                        }
                    }
                    else{
                        if(item[field])
                        {
                            item.text = item[field];
                        }
                    }
                }
            }
            else{
                item.text = item.name;
            }
        }
        // no need to return because it is passed by reference so original array is changed
        return partners_array;
    }
});
