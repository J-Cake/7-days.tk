# krakendb

The package contains a very basic method of managing what is essentially, a database.

The package can create, read, write and delete content in a very basic manner.

To install the package, type:

    npm install krakendb --save

To use:

    const krakendb = require("krakendb");

To create a database:

    krakendb.newdb();

 - this function takes two arguments, the name of the Database and the names of the rows.
 - The second argument can be an array of strings, if this is the case, all the row names will be named according to the array values.
 - If, however, this is not the case, and instead, an integer is provided, the rows will be named by number.
 - These are the only methods of naming rows. once this is set, this cannot be changed.

To add a new entry to the database:

    krakendb.newEntry();

 - This takes a single argument, the name of the entry.

To set an item:

    krakendb.setItem();

 - This function takes 3 arguments, the entry, item and value in that order.

 - The first argument specifies the entry to reference.
 - The second argument references the item, or the column, if the database is looked at in the form of a table.
 - The third argument is the value that the referenced item will be set to.

To retrieve an item:

    krakendb.getItem();

 - Takes 2 arguments, entry and optionally, item.

 - If only one argument is provided, returns whole entry in Array form
 - if both, returns string with value of referenced value.
 - Throws error if item doesn't exist to help with referencing.

To delete an item:

    krakendb.delItem();

 - Takes 2 arguments, entry and optionally, item.

 - If only one argument is provided, deletes whole entry in Array form
 - if both, deletes referenced value.

To switch databases:

    krakendb.activeDB();

 - Takes one argument, database name.

__New in version 1.2.0:__

To export a Database to a file:

    krakendb.exportdb();

 - takes one argument, db name. extension not required. exports as JSON

To load db from file:

    krakendb.loaddb();

 - takes one argument, db name. extension not required.
 db must be in a folder called "krakendb" which is located in the source tree.

To check if db exists:

    krakendb.dbexists();

 - takes one argument, db name. returns true if db exists either exported or unexported, false if otherwise.

__New in version 1.3.0:__

To check whether db contains item:

    krakendb.indb()

 - takes one argument. checks whether string occurs in db.

To check whether a field is filled:

    krakendb.isset()

 - takes 2 arguments, item and row. returns true if item does not equal null, false if otherwise.
 - argument 2 is optional.

__New in version 1.4.0__

A new way of adding information: push:
    
    krakendb.push()

 - takes 2 arguments, entry name and array of values for the data. Array length must match the number of rows. throws error if else.

Get item by row index:
    
    krakendb.getByIndex()

 - takes 2 arguments, item and row
 - argument 2 is optional

Set item by row index:

    krakendb.setByIndex()

 - takes 3 arguments, item, row and value

Get number of rows in database:

    krakendb.length()

__Changes:__
getItem

    krakendb.getItem()

 - Now throws error if item or row does not exist.

setItem

    krakendb.setItem()

 - Now throws error if item or row does not exist.

 minor bugfix
 exportdb

    krakendb.exportdb()

 - Now takes no arguments and is faster.
 - bugs were fixed.

loaddb

    krakendb.loaddb()

 - Now actually loads the data. Before this release, the data was not being applied to the object correctly, this is fixed.

__If you find any bugs, please report them to https://github.com/KlaussMC/krakendb. If you wish to comment, or if you wish to contribute, feel free. I would happily accept help and feedback.__
