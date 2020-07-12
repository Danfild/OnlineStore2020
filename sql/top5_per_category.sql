

with free_items as (select id, good_id from product.items where is_sold = false and booked_by_user is null),

     sold_items as (select id, good_id from product.items where is_sold = true),
     general_info as (
         select MAX(shop.product.goods.id)          as good_id,
                MAX(shop.product.goods.name)        as name,
                MAX(shop.product.goods.category_id) as category_id,
                MAX(shop.product.goods.description) as description,
                MAX(shop.product.goods.image_url)   as image_url,
                MAX(shop.product.goods.price)       as price,
                count(free_items.id)                as in_stock,
                count(free_items.id) > 0            as is_available
         from shop.product.goods
                  left join free_items on goods.id = free_items.good_id
         where goods.category_id = $1
         group by goods.id
         order by name
     ),

     sold_stats as (
         select MAX(shop.product.goods.id) as good_id,
                count(sold_items.id)       as sold_times
         from shop.product.goods
                  left join sold_items on goods.id = sold_items.good_id
         where goods.category_id = $1
         group by goods.id
         order by name
     )

select general_info.good_id      as good_id,
       general_info.name         as name,
       general_info.category_id  as category_id,
       general_info.description  as description,
       general_info.image_url    as image_url,
       general_info.price        as price,
       general_info.in_stock     as in_stock,
       general_info.is_available as is_available,
       sold_stats.sold_times     as sold_times
from general_info
         join sold_stats on general_info.good_id = sold_stats.good_id
order by sold_stats.sold_times desc
limit 5;