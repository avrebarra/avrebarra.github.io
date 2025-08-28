---
layout: post
title: "Auto-Migrations Might Be A Bad Idea 🇮🇩"
highlighted: true
description:
summary:
tags:
series: Thoughts
---

Buat developer seasoned yang sudah sering terlibat dengan berbagai jenis ORM, pasti nggak asing dengan yang namanya Auto-Migration kan ya?

Buat yang belum tahu, saya coba jelaskan sedikit. Migration adalah proses setup/conditioning database (biasanya conditioning struktur tabel dan data) untuk menyesuaikan dengan kebutuhan sistem aplikasi, term migration ini biasa terangkat ketika bicara soal sistem aplikasi backend dengan penggunaan database relational seperti MySQL, PostgreSQL, SQLite, dkk. 

Ketika ditambah dengan kata "Auto", Auto-Migration adalah proses yang menanamkan proses conditioning database di dalam sistem itu sendiri. Sehingga sistem aplikasi bisa melakukan migrasinya sendiri (atau bisa jadi maksudnya migrasi secara otomatis, tapi lebih makesense jika dimaknai self managed migration).

Sehingga ide besarnya adalah ketika app jalan, appnya sendiri bisa menentukan dan mengatur proses conditioning apa yang harus dilakukan pada database yang hendak digunakan.

Nah mari masuk ke opini saya:

**Menurut saya, menyematkan fitur Auto-Migration itu tidak baik, atau lebih tepatnya beresiko buruk terhadap kompleksitas sistem.**

<hr class="separator">

## Kenapa mengatakan bahwa Auto-Migration itu tidah baik?

Oke, mari saya jelaskan. Pertama, mari mulai dengan bicara soal posisi database terhadap sistem kita. Idealnya ketika kita mendesain sebuah sistem yang melibatkan persistensi data, ada baiknya kita mulai dengan asumsi bahwa DB adalah sistem yang terpisah dari sistem kita. Maksudnya kita supaya menganggap bahwa DB itu sistem eksternal yang bicara dengan sistem kita melalui API nya mereka. 

## Kenapa harus membayangkan sebagai bagian terpisah? Bukannya database sistem adalah bagian dari sistem aplikasi itu sendiri?

Memang benar, database merupakan elemen integral dari sebuah sistem aplikasi. Namun, kita perlu menyadari bahwa memandang Database Management System (DBMS) sebagai entitas terpisah membawa manfaat tersendiri. Dalam konteks prinsip-prinsip dasar seperti Single Responsibility Principle (SRP) dan Separation of Concern (SOC), penting untuk memastikan bahwa setiap sistem memfokuskan diri pada satu tugas yang spesifik. Dengan memperlakukan database sebagai lapisan persistensi yang terpisah, kita memungkinkan sistem untuk lebih fokus pada tugas-tugas yang bersifat bisnis atau domain-specific.

## Lah, kalo diekstrak keluar sistem terus sistem tidak tahu dong struktur datanya database?

Ya. Benar. Idealnya seperti itu. Seperti prinsip *caller* tidak perlu tahu cara *callee* bekerja dan hanya perlu tahu hasilnya, sistem kita idealnya tidak perlu mengetahui tetek bengek yang terjadi di dalam database. Sistem aplikasi  kita sepatutnya hanya perlu tahu: *Kalau simpan data disitu, bisa ambil lagi disitu.* *Classic persistence.*

## Terus, gimana caranya kita nulis ke MySQL kalau nggak tahu struktur datanya? Kita kan juga perlu buat query supaya bisa menulis/membaca? Kalau app harus ngutik2 DB pasti bakal menyentuh database dong?

Nah, disinilah kita mengenalkan tentang adapter layer. Layer ini kita tambahkan tepat diantara app dan dbms yang kita gunakan. Layer ini yang fungsinya mentranslasikan app data ke database data. Layer ini yang akan bersentuhan dengan sistem aplikasi dan segala query language data structure dsb. Tapi yang paling penting, fungsinya hanya untuk translasi dan tidak lebih dari itu. Ingat, Single Responsibility Principle.

## Kalau kodingan tentang database bisa ditulis di layer ini ya? Berarti migration bisa juga dong ditaruh layer ini?

Nah, ini mulai masuk topik yang kita bahas.

Seperti kita bahas sebelumnya, migration adalah praktik/kode yang kita gunakan untuk pengondisian sistem DBMS. Migration sebenarnya bukanlah perpanjangan tangan dari proses sistem aplikasi karena sebenarnya secara murni, aplikasi kita tidak punya responsibility untuk mengatur sistem eksternal diluar dirinya. Migration adalah perpanjangan tangan kita sebagai developer sebagai data manager. Sehingga akan vague jika kita membiarkan migrasi dilakukan sendiri oleh sistem aplikasi dan lepas dari kontrol kita. Mengabaikan prinsip ini bisa mengaburkan batas tanggung jawab aplikasi dan menyebabkan kerancuan dalam pengelolaan sistem.

Ini beresiko karena umumnya migrasi database hadir dengan resiko yang mahal karena bisa jadi melibatkan data krusial dari sistem. Sehingga umumnya perlu mengambil precaution-precaution sebelum melakukan migrasi.

Membiarkan aplikasi untuk menangani migrasi sendiri juga dapat memberikan risiko accountability yaitu pelimpahan responsibility pada pihak yang tidak seharusnya. Sebagaimana kita ketahui, migrasi database sering melibatkan data yang sangat penting bagi keseluruhan sistem. Oleh karena itu, setiap langkah migrasi harus diambil dengan hati-hati dan memperhitungkan semua potensi risiko yang mungkin terjadi.

## Berarti kesimpulannya tidak boleh menaruh migrasi di kode sistem?

Apakah boleh atau tidak menggunakan Auto-Migration ini sebenarnya bukan pertanyaan yang tepat diangkat, karena ini adalah keputusan subjektif. Jika keputusan desain diambil karena trade off dirasa masih bisa ditanggung, maka keputusan menggunakan Auto-Migration tentu boleh-boleh saja.

Pertanyaan yang lebih tepat adalah: Apakah kita bisa mengakomodir tradeoff2 yang dibawa oleh Auto-Migration, precaution-precaution yang harus dimasukkan kedalam kode untuk ada didalam kode sistem aplikasi kita? Jika memang diperlukan dan diperkenankan maka oke. Tapi sepengalaman saya, umumnya di awal pengembangan sebuah sistem, akan lebih nyaman sekali jika kita bisa develop sistem tanpa perlu memikirkan hal ini sebagai responsibilitas sistem kan?

## Jadi kesimpulannya adalah?

Kesimpulannya, menyatukan proses migrasi database ke dalam kode sistem aplikasi melalui fitur Auto-Migration bisa meningkatkan kompleksitas sistem aplikasi dan melanggar prinsip-prinsip seperti Single Responsibility Principle dan Separation of Concern. Idealnya, migrasi database bisa dianggap sebagai tanggung jawab terpisah. Sehingga, memisahkan proses migrasi dari kode sistem aplikasi akan lebih memungkinkan untuk mengelola dan mengakomodasi precaution-precaution yang diperlukan.

Tapi kembali lagi semua tergantung pada tradeoff yang bisa kita tanggung. Jika kita merasa bisa menanggung tradeoff dan mendapatkan manfaat yang lebih besar dari tradeoff yang ditanggung, maka menggabungkan sistem migration data kedalam sistem kita akan sah-sah saja. 

## Berarti tidak apa ya? Soalnya capek kalau memisah-misah migration dari sistem?

Tidak apa-apa, asal tahu tradeoffnya. Pakai Auto-Migration juga gapapa. Dengan tahu tradeoffnya, walaupun memutuskan untuk menyematkan fitur migrasi data kedalam aplikasi, kita tetap tahu garis (imajiner) yang memisahkan antara migration dan aplikasi.

Kalaupun sekarang kita memutuskan untuk blur the lines Dan menggabungkan saja untuk mencapai practicality, sah-sah saja. Setidaknya untuk selanjutnya, keputusan itu jadi concious design decision dan bukan mindless practicality saja. Kita dengan sengaja tahu bahwa kita memasukkan kode ini karena kita memang ingin sistem aplikasi kita ikut memegang responsibility bagian kondisioning DBMS. Hasilnya sama saja but with better understanding.

Semoga bermanfaat. *Tchau. Boa noite.*