alter table authorities
    drop foreign key fk_authorities_users;
alter table group_authorities
    drop foreign key fk_group_authorities_group;
alter table group_members
    drop foreign key fk_group_members_group;
alter table client_user
    drop foreign key client_user_users_username_fk;
