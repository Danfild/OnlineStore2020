
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


do $$
begin
for r in 0..499 loop
insert into product.items (good_id) values(r/10+1);
end loop;
end;
$$;

