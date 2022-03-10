# -*- coding: utf-8 -*-
{
    'name': "Additional Customer Fields",

    'summary': """
    when there are too much customers then this module helps
        """,
    'author': "Visiomate sami",

    # any module necessary for this one to work correctly
    'depends': ['point_of_sale'],

    # always loaded
    'data': [
        'views/pos_template.xml',
    ],
    'qweb': ['static/src/xml/customer.xml'],
}