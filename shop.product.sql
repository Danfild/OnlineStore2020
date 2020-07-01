create schema product;

create table shop.product.categories (
    id serial ,
    name text not null,
    image_url text,
    primary key (id)
);

;create table shop.product.goods (
    id serial ,
    name text not null ,
    price float8 not null ,
    category_id integer not null,
    image_url text,
    sold_times integer default 0,
    in_stock int not null,
    description text not null,
    primary key (id)

);

create table shop.product.items (
    id serial,
    good_id integer not null ,
    booked_by_user integer,
    is_sold boolean,
    order_id integer not null ,
    count int,
    primary key (id)
);

create table shop.product.orders (
    id serial ,
    user_id integer not null ,
    sum float8 not null ,
    address text,
    order_date timestamp with time zone,
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

INSERT INTO product.goods ("name",price,category_id,image_url,in_stock,description)VALUES ('AMD Ryzen 5 2600','8399', 1,'ryzen2600.jpg',10,'6 ядерный процессор амд');
INSERT INTO product.goods ("name",price,category_id,image_url,in_stock,description)VALUES ('Intel Core i5-9400F','11399', 1,'9400.jpg',10,'6 ядерный процессор интел');
INSERT INTO product.goods ("name",price,category_id,image_url,in_stock,description)VALUES ('RTX 2080 TI', '83999', 2,'rtx2080.jpg',5,'Видеокарта с трассировкой');
INSERT INTO product.goods ("name",price,category_id,image_url,in_stock,description)VALUES ('RX 5700 XT', '38911', 2,'rx5700.jpg',10,'Видеокарта от амд');
INSERT INTO product.goods ("name",price,category_id,image_url,in_stock,description)VALUES ('MSI B450M','5750', 3,'b450.jpg',12,'Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,in_stock,description)VALUES ('MSI Z390','14790',3,'z390.jpg',10,'Материнская плата.');
INSERT INTO product.goods ("name",price,category_id,image_url,in_stock,description)VALUES ('InWin 915', '31999',4,'inwin915.jpg',5,'Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,in_stock,description)VALUES ('Cougar Conquer 2','20199',4,'cougar2.jpg',15,'Корпус со стеклом.');
INSERT INTO product.goods ("name",price,category_id,image_url,in_stock,description)VALUES ('SAMSUNG 860 EVO 250','4399',5,'evo860.jpg',10,'ССд на 250гб от САМСУНГ');
INSERT INTO product.goods ("name",price,category_id,image_url,in_stock,description)VALUES ('Kingston uv500 240','4000',5,'uv500.jpg',2,'ССд на 240гб от Кингстон');

insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('vasya_petin@mail.ru', 'Vasya', 'Петинин', '12345', '89119220102', true);
insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('Petr1337@mail.ru', 'Petr', 'Васинин', '54321qwe', '89339440203', false);
insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('Vlad007@mail.ru', 'Vlad', 'Давлетов', 'qwerty123', '89129340506', false);
insert into product.users (email,username,last_name,password,phone_num, is_admin)values ('Petr1337@mail.ru','Аня','Емец','123456','89439650203',false);
insert into product.users (email,username,last_name,password,phone_num, is_admin) values('Vlad007@mail.ru','Ваня','Багуров','пароль12345','89879780506',false);



INSERT INTO product.orders (user_id, sum, address,  order_date) VALUES (1,500,'ул.Пушкина 1','now');
INSERT INTO product.orders (user_id, sum, address,  order_date) VALUES (2,500,'ул.Ленина 17','now');
INSERT INTO product.orders (user_id, sum, address,  order_date) VALUES (3,500,'ул.Колотушнкино','now');

INSERT INTO product.items (good_id , is_sold,order_id) VALUES (2, true, 1);
INSERT INTO product.items (good_id, is_sold,order_id) VALUES (1, false,2);
INSERT INTO product.items (good_id, is_sold,order_id) VALUES (2, true, 3);

