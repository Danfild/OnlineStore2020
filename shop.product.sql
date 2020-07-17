
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
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('GIGABYTE GeForce GTX 1660 SUPER Gaming OC', '20799', 2,'1660.jpg','Видеокарта от GIGABYTE');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('MSI AMD Radeon RX 580 ARMOR OC', '14499', 2,'580.jpg','Видеокарта от амд');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('GIGABYTE GeForce RTX 2070 Super WINDFORCE OC 3X', '43299', 2,'rtx2070.jpg','Видеокарта от GIGABYTE');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('GIGABYTE AMD Radeon RX 5500XT GAMING OC', '15799', 2,'5500XT.jpg','Видеокарта от амд');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('GIGABYTE GeForce GTX 1050 Ti OC LP', '10999', 2,'1050ti.jpg','Видеокарта от GIGABYTE');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('GIGABYTE GeForce RTX 2080 Ti AORUS XTREME', '106999', 2,'2080ti.jpg','Видеокарта от GIGABYTE');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('MSI B450M','5750', 3,'b450.jpg','Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('MSI Z390 MPG GAMING PLUS','10499', 3,'Z390.jpg','Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('MSI MPG Z490 GAMING PLUS','14999', 3,'Z490.jpg','Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('ASUS PRIME Z390M-PLUS','10199', 3,'Z390M.jpg','Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('ASUS TUF B450-PRO GAMING','10599', 3,'B450pro.jpg','Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('ASRock Fatal1ty X470 Gaming K4','12599', 3,'X470.jpg','Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('DEEPCOOL MATREXX 70 3F','7899',4,'DP70.jpg','Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('CORSAIR Carbide Series SPEC-DELTA RGB','6499',4,'carbide.jpg','Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Aerocool Tor Pro','7190',4,'torpro.jpg','Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Cougar Panzer-G','7799',4,'panzerg.jpg','Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Chieftec SCORPION II','7250',4,'scn2.jpg','Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('NZXT H510','7399',4,'H510.jpg','Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Hikvision V100','8299',5,'V100.jpg','ССд на 512гб от Hikvision');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('WD Green','8150',5,'WD Green.jpg','ССд на 1024гб от Western Digital');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('SiliconPower Slim S70','8150',5,'S70.jpg','ССд на 240гб от SiliconPower');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('SAMSUNG PM883','13399',5,'PM883.jpg','ССд на 480гб от САМСУНГ');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Seagate BarraCuda','4099',5,'BC.jpg','ССд на 250гб от Seagate');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Intel 545s','4099',5,'545s.jpg','ССд на 256гб от Intel');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Intel Core i3-9100F','6799', 1,'9100.jpg','4 ядерный процессор интел');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('AMD Ryzen 5 1600','7750', 1,'1600.jpg','6 ядерный процессор амд');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('AMD Ryzen 7 PRO 1700X','9299', 1,'1700.jpg','8 ядерный процессор амд');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Intel Core i7-9700K','30699', 1,'9700K.jpg','8 ядерный процессор интел');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('AMD Ryzen 3 3200G','6799', 1,'3200G.jpg','4 ядерный процессор амд');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Intel Core i9-9900K','39499', 1,'9900K.jpg','8 ядерный процессор интел');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('AMD Ryzen Threadripper 3960X','119999', 1,'3960X.jpg','24 ядерный процессор амд');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('AMD Ryzen Threadripper 2990WX','106999', 1,'2990WX.jpg','32 ядерный процессор амд');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('MSI GeForce RTX 2070 Super GAMING X TRIO', '47499', 2,'rtx2070.jpg','Видеокарта с многоцветной подсветкой');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Palit GeForce RTX 2060 Super Dual', '32999', 2,'rtx2060.jpg','Видеокарта с подсветкой');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('MSI TRX40 PRO','36999', 3,'TRX40.jpg','Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('ASUS Pro WS W480-ACE','29999', 3,'W480.jpg','Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('InWin A1 Plus', '18499',4,'A1.jpg','Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('GAMER STORM New Ark 90MC', '15299',4,'90MC.jpg','Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Intel D5 P4320 Series','127999',5,'P4320.jpg','ССд на 7680гб от Intel');
INSERT INTO product.goods ("name",price,category_id,image_url,description)VALUES ('Intel D3-S4610 Series','89999',5,'S4610.jpg','ССд на 3840гб от Intel');

insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('vasya_petin@mail.ru', 'Vasya', 'Петинин', '12345', '89119220102', true);
insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('Petr1337@mail.ru', 'Petr', 'Васинин', '54321qwe', '89339440203', false);
insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('Vlad007@mail.ru', 'Vlad', 'Давлетов', 'qwerty123', '89129340506', false);
insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('Petr1337@mail.ru','Аня','Емец','123456','89439650203',true);
insert into product.users (email,username,last_name,password,phone_num, is_admin) values('Vlad007@mail.ru','Ваня','Багуров','пароль12345','89879780506',false);


do $$
begin
for r in 0..499 loop
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






