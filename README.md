# Master catalog filter App
> Master catalog filter via *.csv file.

## Install
In console open project folder. 

```
$ npm install
```

## Usage

#### Usage without options
Upload default files into folder  `./demo_files/`:

* Master catalog: `./demo_files/catalog.xml`
* CSV file with id-s of products: `./demo_files/catalog-to-import.csv`

```
$ npm start
```

or

```
$ node index.js
```

#### Options
##### --csv

Type: `string`<br>
Default: `./demo_files/catalog-to-import.csv` <br>
The input csv file

```
$ node index.js --csv 'file.csv'
```

##### --catalog

Type: `string`<br>
Default: `./demo_files/catalog.xml` <br>
The input master catalog file

```
$ node index.js --catalog 'file.xml'
```

##### --output

Type: `string`<br>
Default: `./output/<dateTime>_filtered.xml` <br>
The output file with filtered products.

```
$ node index.js --output 'file.xml'
```

##### --logs

Type: `string`<br>
Default: `./output/<dateTime>_logs.log` <br>
The output log file.

```
$ node index.js --logs 'file.log'
```

##### --overwrite

Type: `boolean`<br>
Default: `false` <br>
Overwrite output and logs file if they are exist. Using with options: `output` or `logs`.

```
$ node index.js --output 'file.xml' --logs 'file.log' --overwrite
```

##### --help
Print this usage guide.
