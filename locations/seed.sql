
create table Events(
Eventid int primary key identity,
EventName varchar(150) NOT NULL,
EventDescription varchar(1000) NOT NULL,
TimeStart datetime,
TimeEnd datetime,
locationid int,
AdminId int,
foreign key (AdminId) references Admin(AdminId),
foreign key (locationid) references Location(Id)
)

CREATE TABLE Locations(
    id INT PRIMARY KEY IDENTITY,
    name VARCHAR(150) NOT NULL,
    streetaddress VARCHAR(255) NOT NULL,
    postalcode VARCHAR(20) NOT NULL,
    telnum VARCHAR(20) NOT NULL
);