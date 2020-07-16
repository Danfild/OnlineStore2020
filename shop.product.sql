create schema product;

create table shop.product.categories (
    id serial ,
    name text not null,
    image_url text,
    primary key (id)
);

create table shop.product.goods (
    id serial ,
    name text not null ,
    price float8 not null ,
    category_id integer not null,
    image_url text,
    description text not null,
    full_description text ,
    primary key (id)
);

create table shop.product.items (
    id serial,
    good_id integer not null ,
    booked_by_user integer,
    is_sold boolean default false,
    order_id integer ,
    primary key (id)
);
--CREATE TYPE mood AS ENUM ('created', 'send', 'delivered');
create table shop.product.orders (
    id serial ,
    user_id integer not null ,
    address text,
    price float8 not null ,
    order_date timestamp with time zone,
    order_status mood default 'created',
    primary key (id)
);

create table shop.product.users (
    id serial ,
    email text not null ,
    username text ,
    last_name text,
    password text not null ,
    phone_num text,
    is_admin boolean not null,
    primary key (id)
);

alter table product.goods  add constraint fk_categories_goods foreign key (category_id) references product.categories(id) on update no action on delete cascade;
alter table product.items  add constraint fk_items_booked_by_user foreign key (booked_by_user) references product.users(id) on update no action on delete cascade;
alter table product.items  add constraint fk_items_goods foreign key (good_id) references product.goods(id) on update no action on delete cascade;
alter table product.items  add constraint fk_items_orders foreign key (order_id) references product.orders(id) on update no action on delete cascade;
alter table product.orders  add constraint fk_orders_users foreign key (user_id) references product.users(id) on update no action on delete cascade;

INSERT INTO product."categories" ("name",image_url)VALUES ('Процессоры','category1.jpg');
INSERT INTO product."categories" ("name",image_url)VALUES ('Видеокарты','category2.jpg');
INSERT INTO product."categories" ("name",image_url)VALUES ('Материнские платы','category3.jpg');
insert into product."categories" ("name",image_url)VALUES ('Корпуса','category4.jpg');
insert into product."categories" ("name",image_url) values ('SSD-накопители','category5.jpg');

INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('AMD Ryzen 5 2600','8399', 1,'2600.jpg','6 ядерный процессор амд');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Intel Core i5-9400F','11399', 1,'9400.jpg','6 ядерный процессор интел');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('RTX 2080 TI', '83999', 2,'2080.jpg','Видеокарта с трассировкой');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('RX 5700 XT', '38911', 2,'rx5700.jpg','Видеокарта от амд');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('MSI B450M','5750', 3,'b450.jpg','Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('MSI Z390','14790',3,'z390.jpg','Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('InWin 915', '31999',4,'inwin915.jpg','Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Cougar Conquer 2','20199',4,'cougar2.jpg','Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('SAMSUNG 860 EVO 250','4399',5,'evo860.jpg','ССд на 250гб от САМСУНГ');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Kingston uv500 240','4000',5,'uv500.jpg','ССд на 240гб от Кингстон');

insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('vasya_petin@mail.ru', 'Vasya', 'Петинин', '12345', '89119220102', true);
insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('Petr1337@mail.ru', 'Petr', 'Васинин', '54321qwe', '89339440203', false);
insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('Vlad007@mail.ru', 'Vlad', 'Давлетов', 'qwerty123', '89129340506', false);
insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('Petr1337@mail.ru','Аня','Емец','123456','89439650203',false);
insert into product.users (email,username,last_name,password,phone_num, is_admin) values('Vlad007@mail.ru','Ваня','Багуров','пароль12345','89879780506',false);



do $$
begin
for r in 0..99 loop
insert into product.items (good_id) values(r/10+1);
end loop;
end;
$$;

select * from product.goods where price > 7000;
select * from product.orders;
select * from product.users;

select * from product.orders where user_id = 3;

--сумма заказа
select product.orders.sum     as сумма,
       product.orders.address as адрес,
       product.orders.id as Номер_заказа,
       product.goods."name"
       from product.orders  right join product.items on orders.id = items.order_id
       join product.goods on product.items.good_id =goods.id;

--сколько товара есть
select product.categories.name as "Название категории",
       product.goods.name as "Название товара",
       product.goods.price as "Цена"
       from product.categories  join  product.goods on product.categories.id=product.goods.category_id;

--запрос гланвая страница .
--футер.
-- поплурные товары на главной из каждой категории. самые популярные товары в разделе ""КОМПЬЮТЕР" - является ссылкой.
-- самые популрные товары
-- запрос к каталогу по фильтрам, по самой обльшой продавемости.( сорптивровка по колонке, и вывод топ 5 предложений)
-- выбери картинка,цена, навзание, описание,
--
--таблица создание нового товара передача уже существующей картинки.
--при вставление ссылки в хтмл
-- если инсток


--топ 5:
select name, description, image_url, price from product.goods where category_id = ? order by desc limit 5


--каталог в категории:
select name, description, image_url, price from product.goods where category_id = ? order by name, price
from product.goods where category_id = ? order by sold_times desc limit 5;

select name, description, image_url, price from product.goods where category_id = ? order by name;


--написать роут на бронирование товара(добалвание в коорзину)имя роута и параметры роута берутся из формы отправки.
--этот рооут должен идти в таблицу и апдейтить у превого найдеого айтема который не прдоан и соотсветввует гуд айди, этог опарметра и сетить бухт бай юзер.
--каталог всех юзеров, отображение товаров топ -5 товаров на галвной.
--у реквеста брать юзера, а у пол--заказ инфо
-- инфа о заказе.
select product.orders.address as Адресс,
       product.orders.order_date as Дата,
       product.items.order_id as "Номер заказа",
       product.goods.name as "Название товара",
       product.users.username as Имя

       from product.orders  right join product.items on orders.id = items.order_id
       join product.goods on product.items.good_id = goods.id
       left join product.categories on product.goods.category_id=product.categories.id
       join product.users on  product.orders.user_id=product.users.id;

--общее кол-во товара по категории
select MAX(shop.product.goods.id) as good_id,
       MAX(shop.product.goods.name) as name,
       MAX(shop.product.goods.description) as description,
       MAX(shop.product.goods.image_url) as image_url,
       MAX(shop.product.goods.price) as price,
       count(shop.product.items.id) as in_stock
       from shop.product.goods join shop.product.items on goods.id = items.good_id where goods.category_id = 1 group by goods.id ;

select MAX(shop.product.goods.id) as goodId, MAX(shop.product.goods.name) as name, MAX(shop.product.goods.description) as description, MAX(shop.product.goods.image_url) as image_url, MAX(shop.product.goods.price) as price, max(shop.product.items.booked_by_user) as book, MAX(shop.product.categories.name) as category, count(shop.product.items.id) as inStock from shop.product.goods join  shop.product.categories on goods.category_id = categories.id join shop.product.items  on items.good_id=goods.id where items.good_id = 1 limit 1;

select MAX(shop.product.goods.id) as goodId, MAX(shop.product.goods.name) as name, MAX(shop.product.goods.description) as description,MAX(shop.product.goods.image_url) as image_url,MAX(shop.product.goods.price) as price,       MAX(shop.product.categories.name) as category, count(shop.product.items.id) as inStock from shop.product.goods join  shop.product.categories on goods.category_id = categories.id join shop.product.items  on items.good_id=goods.id where items.good_id = 1 and items.order_id is null;

update shop.product.items set  booked_by_user = 1 where id = 2;

SELECT *  FROM shop.product.users WHERE is_admin =  true;


-- взять конкретный товар,вывести его имя,описание,цену,сколько продано этого товара и топ 5 продоваемых товаров.

select MAX(shop.product.goods.id) as good_id,
       MAX(shop.product.goods.name) as name,
       MAX(shop.product.goods.description) as description,
       MAX(shop.product.goods.image_url) as image_url,
       MAX(shop.product.goods.price) as price,
       count(shop.product.items.id) as in_stock
       from shop.product.goods  join  shop.product.items on goods.id = items.good_id
       right join shop.product.categories on  goods.category_id = categories.id where goods.category_id = 1 and shop.product.items.is_sold = false and items.booked_by_user is null group by goods.id ;

--Отображение едениц товара
select MAX(shop.product.goods.id) as good_id,
       MAX(shop.product.goods.name) as name,
       MAX(shop.product.goods.description) as description,
       MAX(shop.product.goods.image_url) as image_url,
       MAX(shop.product.goods.price) as price,
       count(shop.product.items.id) as in_stock
       from shop.product.goods join shop.product.items on goods.id = items.good_id
       where goods.category_id = 1
       and items.is_sold = false
       and items.booked_by_user is null and items.good_id=2
      group by goods.id
      order by in_stock desc limit 5;


--Отображение топ 5 товаров
select MAX(shop.product.goods.id) as good_id,
       MAX(shop.product.goods.name) as name,
       MAX(shop.product.goods.description) as description,
       MAX(shop.product.goods.image_url) as image_url,
       MAX(shop.product.goods.price) as price,
       max(shop.product.goods.category_id) as category,
       count(shop.product.items.id) as in_stock
       from shop.product.goods join shop.product.items on goods.id = items.good_id
       where items.is_sold = false
       and items.booked_by_user is null
       group by goods.id  order by  good_id  desc  limit 5;


select MAX(shop.product.goods.id) as goodId,
       MAX(shop.product.goods.name) as name,
       MAX(shop.product.goods.description) as description,
       MAX(shop.product.goods.image_url) as image_url,
       MAX(shop.product.goods.price) as price,
       count(shop.product.items.id) as in_stock
       from shop.product.goods join shop.product.items on goods.id = items.good_id
       where items.is_sold = false
       and items.booked_by_user is null and goods.category_id = 2
       group by goods.id  order by  name ;

select id,booked_by_user from product.items where good_id =2 and booked_by_user is null and is_sold = false limit 1;

update shop.product.items set is_sold = false where is_sold is null;

update shop.product.items set booked_by_user = 1  where id = (select id from product.items where good_id =2 and booked_by_user is null and is_sold = false limit 1);

update shop.product.items set booked_by_user = 1  where id = (select id from product.items where good_id = 10 and booked_by_user is null and is_sold = false limit 1);

insert into shop.product.goods (name, price, category_id, image_url, description) values ('tset',0,1,null,'12345');

select MAX(shop.product.goods.id) as good_id, MAX(shop.product.goods.name) as name,
         MAX(shop.product.goods.description) as description,
         MAX(shop.product.goods.image_url) as image_url,
         MAX(shop.product.goods.price) as price,
         count(shop.product.items.id) as in_stock from shop.product.goods
         join shop.product.items on goods.id = items.good_id where items.is_sold = false
         and items.booked_by_user is null group by goods.id order by description, in_stock limit 5;
select product.goods.id as good_id,
       product.goods.name as name,
       product.goods.description as description,
       product.goods.image_url as image_url,
       product.goods.price as price,
       product.items.id as in_stock
       from shop.product.goods inner join







--отображение заказов
select
       shop.product.users.username as name,
       shop.product.users.last_name as lastName,
       shop.product.users.phone_num as phone,
       shop.product.orders.address as adress,
       shop.product.goods.name as good,
       shop.product.goods.price as price
       from shop.product.items  join shop.product.goods on items.good_id = goods.id
       join shop.product.users on shop.product.items.booked_by_user = shop.product.users.id
       join shop.product.orders on shop.product.users.id = shop.product.orders.user_id;


update shop.product.items set (booked_by_user,order_id) = ( 1,1 )  from product.goods where good_id = 1;



--топ 5:
select name, description, image_url, price from product.goods where category_id = ? order by sold_times desc limit 5;

--каталог в категории:
select name, description, image_url, price from product.goods where category_id = ? order by name


select * from shop.product.goods where category_id = 1;






