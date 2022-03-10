from datetime import datetime

from odoo import models, fields, api
from odoo.exceptions import ValidationError


class ResPartnerTSTInherit(models.Model):
    _inherit = 'res.partner'
    vehicle_number = fields.Char()

    @api.model
    def search_read(self, domain=None, fields=None, offset=0, limit=None, order=None):
        if not domain:
            domain = []
        last_field = 1
        # last_field = fields[len(fields) - 1]
        if last_field != 'loading_data_offline':
            res = super().search_read(domain=domain, fields=fields, offset=offset, limit=limit, order=order)
            return res
        
        cr = self._cr
        less_fields = [f for f in fields]
        del less_fields[-1]
        del less_fields[-1]
        del less_fields[-1]
        del less_fields[-1]
        fields_str = ",". join(less_fields)
        query = f"""SELECT distinct {fields_str} from res_partner"""
        cr.execute(query)
        partners = cr.dictfetchall()
        partner_ids = []
        partners_dict = {}
        for customer in partners:
            for key in customer:
                if not customer.get(key):
                    customer[key] = False
            customer['write_date'] = str(customer['write_date'])[0:19]
            partner_ids.append(customer['id'])
            partners_dict[customer['id']] = customer

        self.get_related_parents(partners_dict, partner_ids, 'country_id')
        self.get_related_parents(partners_dict, partner_ids, 'state_id')
        self.get_related_parents(partners_dict, partner_ids, 'property_account_position_id')

        res = partners
        return res

    def get_related_parents(self, partners_dict, partner_ids, field_name):
        records = self.env['res.partner'].search_read([('id', 'in', partner_ids), (field_name, '!=', False)], fields=[field_name])
        for ob in records:
            partners_dict[ob['id']][field_name] = [ob[field_name][0], ob[field_name][1]]
