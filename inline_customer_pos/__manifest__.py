# -*- coding: utf-8 -*-
{
    'name': "Inline Customer",
    'description': """
        Customer Selection Brought to Order Page
    """,
    'category': 'Sales',
    'version': '0.1',
    'depends': ['point_of_sale'],

    # always loaded
    'data': [
        'views/inline_customer.xml',
    ],
    'auto_install': True,
    
    
    
    
    
    'assets': {
        'web.assets_qweb': [
            'inline_customer_pos/static/xml/inline_customer.xml',
        ],
    },
    'author': "sami",
}
