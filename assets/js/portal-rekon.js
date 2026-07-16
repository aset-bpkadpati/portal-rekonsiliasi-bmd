/*
  KONFIGURASI LINK REKONSILIASI
  Tempel URL Google Sheet milik setiap OPD pada properti `url`.
  Bila `url` masih kosong, kartu OPD akan tampil namun tidak bisa dibuka.
*/
const KERTAS_KERJA_URL = Object.fromEntries(`Badan Kepegawaian Dan Pengembangan SDM|https://docs.google.com/spreadsheets/d/1kHsq_ySBruqjKeKmzjoFfNeFbshnrRBnG3z_VoYfypM/edit?usp=drivesdk
Badan Kesatuan Bangsa dan Politik|https://docs.google.com/spreadsheets/d/1SzpTXucsDzhqkoEmrY4xFRvVNzfN3XT-3Lmysn1-0gM/edit?usp=drivesdk
Badan Penanggulangan Bencana Daerah|https://docs.google.com/spreadsheets/d/1-QMvENmwzo-Ek-AG3OJImDxqMwmKtW0ZDPOEQCRmxGY/edit?usp=drivesdk
Badan Pengelolaan Keuangan dan Aset Daerah|https://docs.google.com/spreadsheets/d/1iFb-74YSzc4LSlEWF8F4WRBKk2wCiwrWWr_Xg1TtvxY/edit?usp=drivesdk
Badan Perencanaan Pembangunan Riset dan Inovasi Daerah|https://docs.google.com/spreadsheets/d/1TsidT9FyMUKVL8XEwMCAhRRwudnEJ_rE6HWEYtyvQIY/edit?usp=drivesdk
Dinas Kearsipan dan Perpustakaan|https://docs.google.com/spreadsheets/d/1ozqlEdW7lldns8iYqgZc-05mGMfzfDnQpIkcGvj_lfk/edit?usp=drivesdk
Dinas Kelautan dan Perikanan|https://docs.google.com/spreadsheets/d/1ll4JvNeCPeCfOGq8ytt0FzRAEz7s2y3pH9M-5AcDljk/edit?usp=drivesdk
Dinas Kepemudaan Olahraga dan Pariwisata|https://docs.google.com/spreadsheets/d/1dask_Eio_Bcc066d93R3TPjzHjMtQRvtPi6hoMNOgQI/edit?usp=drivesdk
Dinas Kependudukan dan Pencatatan Sipil|https://docs.google.com/spreadsheets/d/1tXT_YvDZ30qpjaEILvIwMLiX2tynEqGx6SXsn7u7sZc/edit?usp=drivesdk
Dinas Kesehatan|https://docs.google.com/spreadsheets/d/1WTDKiQhWaD0et3D4nCEgDYE1iqvOeAIBu9Nfwa-axYQ/edit?usp=drivesdk
Dinas Ketahanan Pangan|https://docs.google.com/spreadsheets/d/1hJ9FxBbIDrbXNLuVNf9fQGs35km38K_9ncCboq1swnc/edit?usp=drivesdk
Dinas Komunikasi dan Informatika|https://docs.google.com/spreadsheets/d/1w00iHL2ARpGSiAojHWMfYeFGLkuXaLr_p3rwjgSnN28/edit?usp=drivesdk
Dinas Koperasi, Usaha Mikro, Kecil dan Menengah|https://docs.google.com/spreadsheets/d/1CJvJJBtstEkI9CFVYY_FMxSsQ2XeFgJgrErgl_8Q3Sk/edit?usp=drivesdk
Dinas Lingkungan Hidup|https://docs.google.com/spreadsheets/d/1x04qRfvJQTpbm_AAeRjhCCX014hybRd3B00LEUxpe1I/edit?usp=drivesdk
Dinas Pekerjaan Umum dan Penataan Ruang|https://docs.google.com/spreadsheets/d/1p5ur9chKTEL6P6SboMlqtc70LoTreCMuCOCEdaUMkkk/edit?usp=drivesdk
Dinas Pemberdayaan Masyarakat dan Desa|https://docs.google.com/spreadsheets/d/1SMUCbLpxKdvXVCQICpxhNQz63kLQCRX8iScEUaOkmgE/edit?usp=drivesdk
Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu|https://docs.google.com/spreadsheets/d/1Bj6o76GM0XgnVsoLHD8L8TT5DA1Cb-N7J1FgWOyzuf4/edit?usp=drivesdk
Dinas Pendidikan dan Kebudayaan|https://docs.google.com/spreadsheets/d/1fklM5gPEyHaBOdXdgEml9vuUGUFYa817yiG7kw3HDCI/edit?usp=drivesdk
Dinas Perdagangan dan Perindustrian|https://docs.google.com/spreadsheets/d/1573-I8BuYzDIvez2u9fG7qRD6Mup2tphh2p9qB1XfYQ/edit?usp=drivesdk
Dinas Perhubungan|https://docs.google.com/spreadsheets/d/1KOC8CQopEGm0v-jDdq3nksAQTf0Z4L6IdIaOlzAun_g/edit?usp=drivesdk
Dinas Pertanian|https://docs.google.com/spreadsheets/d/1AY5KjhC-T0LSAwjjzGcgA5uvxkTe1S6PTIbqEIHXOks/edit?usp=drivesdk
Dinas Perumahan dan Kawasan Pemukiman|https://docs.google.com/spreadsheets/d/1yym75m1ltqH4obLmQx9Ia_mhBK3jsKRUu2edgw6pDvA/edit?usp=drivesdk
Dinas Sosial P3AKB|https://docs.google.com/spreadsheets/d/1jGW2qt2xHFz6B-lyiFp_MT_DP40g8LpfNOtxVeJ3xcs/edit?usp=drivesdk
Dinas Tenaga Kerja|https://docs.google.com/spreadsheets/d/1kZSBcQlBRcvc9e-GnfGnl-UTcuc801f8nNnOIL8YFJk/edit?usp=drivesdk
GUDANG FARMASI|https://docs.google.com/spreadsheets/d/1isHC2qIJ-Y7FDNvJo-TClLf4TFfn0GRH27XeQC416AI/edit?usp=drivesdk
Inspektorat Daerah|https://docs.google.com/spreadsheets/d/1v1g0pstT9CzEgsAKrmhdMpo9_8PFSh9A9tHeCkwulHY/edit?usp=drivesdk
Kecamatan Batangan|https://docs.google.com/spreadsheets/d/1Kofhwg__kGMLKEIObmuLQ3WqWtD-0NOpLEMGbQ5PnXs/edit?usp=drivesdk
Kecamatan Cluwak|https://docs.google.com/spreadsheets/d/1WOgGPNzEabv8Mnu1adGvthAWCXangqnNC5We2wYxmDM/edit?usp=drivesdk
Kecamatan Dukuhseti|https://docs.google.com/spreadsheets/d/1w6ph9JDttrXBx48b6SpCPH5eO8VUTdsHaDeOL75NsO8/edit?usp=drivesdk
Kecamatan Gabus|https://docs.google.com/spreadsheets/d/1tsRMlnd7JMOC5LBSo_1VjBS9u1OujuVuf03h1UyrH0I/edit?usp=drivesdk
Kecamatan Gembong|https://docs.google.com/spreadsheets/d/1faSufvTADTkwkwd8Y9cKsANQDr_a6_EW7i2KHFEjVy8/edit?usp=drivesdk
Kecamatan Gunungwungkal|https://docs.google.com/spreadsheets/d/1x2kw5395RGj6k1lOdiHzor0a1_pMEyKKTWvKETn5EO0/edit?usp=drivesdk
Kecamatan Jaken|https://docs.google.com/spreadsheets/d/1SF84SUz7wVBTZrg8Z4HcrPZt6G71R98-O955FBMYF-w/edit?usp=drivesdk
Kecamatan Jakenan|https://docs.google.com/spreadsheets/d/1y0GP-vY6XYOjy2AOxaP31U3ugffcNbsRY2eluLVNfT8/edit?usp=drivesdk
Kecamatan Juwana|https://docs.google.com/spreadsheets/d/1sbWVL_rXc4TkqP6rTIJtWEWmmcHKBAIA7vF0LYoUPUQ/edit?usp=drivesdk
Kecamatan Kayen|https://docs.google.com/spreadsheets/d/1AujBgdpAKluOb74976Tz7Yf24kBaulcLSA3V0ulka2c/edit?usp=drivesdk
Kecamatan Margorejo|https://docs.google.com/spreadsheets/d/1UqW_rvUETD0b9FUq-BmPyf5ME1gkbKYoKq9dxY08sMo/edit?usp=drivesdk
Kecamatan Margoyoso|https://docs.google.com/spreadsheets/d/1wryghOT66-xod7fpGS-BPpmtlD1KJuHhNRLXRSbeb-I/edit?usp=drivesdk
Kecamatan Pati|https://docs.google.com/spreadsheets/d/1lmiNlX9C1ZslFVsdvU9gh2qg_HQ0JlN0jS_NSGqPJEQ/edit?usp=drivesdk
Kecamatan Pucakwangi|https://docs.google.com/spreadsheets/d/1iPCipwwBxKmh_dG_VSSnQtm3HXL3iUp8PXkp1akFOI8/edit?usp=drivesdk
Kecamatan Sukolilo|https://docs.google.com/spreadsheets/d/1weJftd3PIBQOa8z1HY2zY8VS2k8UQFhcbtB8CP4H0rk/edit?usp=drivesdk
Kecamatan Tambakromo|https://docs.google.com/spreadsheets/d/1GZgOajPr18prYHdGqXRxi7gsqyC1mYqYsuYJOc7UZOk/edit?usp=drivesdk
Kecamatan Tayu|https://docs.google.com/spreadsheets/d/1HT5I6apMw0_rGj8R1r9xkJ1ACNQjWmjen97yDeX_oWQ/edit?usp=drivesdk
Kecamatan Tlogowungu|https://docs.google.com/spreadsheets/d/16tkuZd-Elt0nM4llj52H0yXxorHe0WnfAlPk-Akhd3g/edit?usp=drivesdk
Kecamatan Trangkil|https://docs.google.com/spreadsheets/d/1skYikSG6qthYvmVxxsnuyCZQq6j4i0wbTgsUDOQpuQo/edit?usp=drivesdk
Kecamatan Wedarijaksa|https://docs.google.com/spreadsheets/d/1JJkSafmBSTz3NkY_ojHmIPuIsc1CIIPxC9cMhabAvVE/edit?usp=drivesdk
Kecamatan Winong|https://docs.google.com/spreadsheets/d/1ZJygcKB_zNUYmxiASwv-MM3vmAoZAJkidIGPQi2B34s/edit?usp=drivesdk
Kelurahan Kalidoro|https://docs.google.com/spreadsheets/d/1ebH_ktQM_ObRMZud5rtzXB1n_L4HwwhXbapGtXIzacc/edit?usp=drivesdk
Kelurahan Parenggan|https://docs.google.com/spreadsheets/d/1kGwioFdXnnKRPhu6rMiBQuiAo17eVQhzGpdIeOxKnA8/edit?usp=drivesdk
Kelurahan Pati Kidul|https://docs.google.com/spreadsheets/d/1Aza3Io3U37VDhfzaEZbbkNrOf4Sp9lSTX5VaSJoMq1Q/edit?usp=drivesdk
Kelurahan Pati Lor|https://docs.google.com/spreadsheets/d/1Pbu36iIWoDeiIjYEV87uiPJLMIMAAJ9w_4NU85iEhB8/edit?usp=drivesdk
Kelurahan Pati Wetan|https://docs.google.com/spreadsheets/d/1aCJEkolGyDriYgD9Ure8e6d0VqnRRCUwjZFzWuiDjM0/edit?usp=drivesdk
LABKESDA|https://docs.google.com/spreadsheets/d/1dIPv7GK-eCrtTxbx0Pv3bT2ezW-yv4lB_A6VZRMzbfM/edit?usp=drivesdk
PUSKESMAS BATANGAN I|https://docs.google.com/spreadsheets/d/1V7B6QiWNq7SkAzJ1A_GRFD2OijQwiNZms4TfVf8brCw/edit?usp=drivesdk
PUSKESMAS CLUWAK I|https://docs.google.com/spreadsheets/d/1hraOs3JwIiPpeOKy7eznyl5eaArrvvGrj7bbBv-vE_c/edit?usp=drivesdk
PUSKESMAS DUKUHSETI|https://docs.google.com/spreadsheets/d/1BUza-LS7f6-WWyZuCtEF8DOK_VQMYf3nO_148ggW1lo/edit?usp=drivesdk
PUSKESMAS GABUS I|https://docs.google.com/spreadsheets/d/1i46Yfz49Wy1lwfPcXSMB_P6A7uUkVpV38RwgmrbMC2Q/edit?usp=drivesdk
PUSKESMAS GABUS II|https://docs.google.com/spreadsheets/d/18AGiqIxsVVgiaJk8H5hQh2yIW7ypeMSFEHQvl0Plv5w/edit?usp=drivesdk
PUSKESMAS GEMBONG I|https://docs.google.com/spreadsheets/d/1FSYlm7gVqtAsGKLgBvqGmzKnj8x-SGl0hxGXHR7PogE/edit?usp=drivesdk
PUSKESMAS GUNUNGWUNGKAL|https://docs.google.com/spreadsheets/d/19Uz0erlk9LSg-F7wH3mCgWaH7j4IT8Vc30bCFchnpdk/edit?usp=drivesdk
PUSKESMAS JAKEN I|https://docs.google.com/spreadsheets/d/1q3WdoMSs_QyIcGoQcZCYLHOo0XWlgACE46JZWekbn8c/edit?usp=drivesdk
PUSKESMAS JAKENAN I|https://docs.google.com/spreadsheets/d/1JEaf7RpiBtR2aeHb1PRDEivMsj39eKqD94zN3LbAB4c/edit?usp=drivesdk
PUSKESMAS JUWANA|https://docs.google.com/spreadsheets/d/18f4Ac3MhbN_S26g1e7DvFhN5nEj6-tzexCIRvcEd3bY/edit?usp=drivesdk
PUSKESMAS KAYEN|https://docs.google.com/spreadsheets/d/1tRqOjg2IwLAPc7mesp6JT9BJHF-3RlnD-5yE6A6YQ-U/edit?usp=drivesdk
PUSKESMAS MARGOREJO I|https://docs.google.com/spreadsheets/d/1tKowKHgXk5zI2eLILWStCW51zrOtzoufaLnDYju_Z-M/edit?usp=drivesdk
PUSKESMAS MARGOYOSO I|https://docs.google.com/spreadsheets/d/1caQO2BneXvakMyHzMzUlz5q8E-RvBcsqFNOLZ1qQvLQ/edit?usp=drivesdk
PUSKESMAS MARGOYOSO II|https://docs.google.com/spreadsheets/d/1r8MTbHWNh7B6vJ9blLAoKVodmmbKaSFdkKUTjOaFZb8/edit?usp=drivesdk
PUSKESMAS PATI I|https://docs.google.com/spreadsheets/d/1tQeZY8QiZPGyfTP0SgfEcMQjwVqWajroNJ5PeNMZAL0/edit?usp=drivesdk
PUSKESMAS PATI II|https://docs.google.com/spreadsheets/d/1hn_YLBQfIHb5mXhgYqmoCjJh8tTH8wxjkFVw8ogavCw/edit?usp=drivesdk
PUSKESMAS PUCAKWANGI I|https://docs.google.com/spreadsheets/d/1Av-TEFvgco8P6mMgTndaGLFs0l9wnT4URz7UkbOyK-Q/edit?usp=drivesdk
PUSKESMAS PUCAKWANGI II|https://docs.google.com/spreadsheets/d/1jSYNVMPjuxxnlMxgbw-CeLQZBDgEQ2CwDPKINKBznYI/edit?usp=drivesdk
PUSKESMAS SUKOLILO I|https://docs.google.com/spreadsheets/d/1-LhUn1XwYN7ltEEmufj1t2FYD3T2iHIsP536rUVDTZA/edit?usp=drivesdk
PUSKESMAS SUKOLILO II|https://docs.google.com/spreadsheets/d/1SMIKOGCfYzgG7ecxPG0r7L6Q-GOOvElymUq9nuZbhig/edit?usp=drivesdk
PUSKESMAS TAMBAKROMO|https://docs.google.com/spreadsheets/d/1sW7RyWpETLEVUxymsADidCEFP9AQ20gMYtoevDGXRDE/edit?usp=drivesdk
PUSKESMAS TAYU I|https://docs.google.com/spreadsheets/d/1u9p-7LTT5Wz9v_B45x2Eh87O3ArGopmXaUryrBqyLpA/edit?usp=drivesdk
PUSKESMAS TAYU II|https://docs.google.com/spreadsheets/d/1UuYmMkqWv6Ggt6bnDqpkfEQ2doHkpsmxD9KMn1fCH74/edit?usp=drivesdk
PUSKESMAS TLOGOWUNGU|https://docs.google.com/spreadsheets/d/1oCNvPFvKmIuHBK9UmvjrMaLW4YaMVSWQ3Y3ZTU_2T4w/edit?usp=drivesdk
PUSKESMAS TRANGKIL I|https://docs.google.com/spreadsheets/d/1kwzA0BxMwflvhWxBUOWgCc3pmtW3YKqBn9ycXIsI0CM/edit?usp=drivesdk
PUSKESMAS WEDARIJAKSA I|https://docs.google.com/spreadsheets/d/1CJsUKhLyNUfnZA7Byah2vkV8ysR51oQrmst9Nyq_v88/edit?usp=drivesdk
PUSKESMAS WEDARIJAKSA II|https://docs.google.com/spreadsheets/d/168CbCp98QyHAb9Pv61pwrQvTv1mLhlj6bVAgXDLH7MY/edit?usp=drivesdk
PUSKESMAS WINONG I|https://docs.google.com/spreadsheets/d/18mEncMrCqDZwWIFZTRcpKvH1Yft0PgyXx9KfCCGE-xY/edit?usp=drivesdk
PUSKESMAS WINONG II|https://docs.google.com/spreadsheets/d/1mKlHiFt8x2as8Zri_RcryOVdQrYq_Aq6MIirNotRiFQ/edit?usp=drivesdk
Rumah Sakit Umum Daerah Kayen|https://docs.google.com/spreadsheets/d/1ebUVnvL-V9YL844iZWE_VyRCSfKvhw3RieyB1OZLDnQ/edit?usp=drivesdk
Rumah Sakit Umum Daerah RAA Soewondo|https://docs.google.com/spreadsheets/d/16rcn69uFj1SCXBKAc4P5tpIH8kZyB8PW9eaueU-Ro_k/edit?usp=drivesdk
SANGGAR KEGIATAN BELAJAR KAB. PATI|https://docs.google.com/spreadsheets/d/1bca5ay6yfg5KUNYQ2etEJNv_3u6S6BFGgXlzvTEPNuc/edit?usp=drivesdk
Satuan Polisi Pamong Praja|https://docs.google.com/spreadsheets/d/1WV8cG-jRqPk1jwk5aHS6pO_TGZz8ME55MoKXN6N4v5Q/edit?usp=drivesdk
Sekretariat Daerah|https://docs.google.com/spreadsheets/d/1aO-RUYa0yzmQt_WYBDtSlDNOfXc6KOulJLfl4YUlD9U/edit?usp=drivesdk
Sekretariat DPRD|https://docs.google.com/spreadsheets/d/1zGgdSSGIjm4rYBnxudV-DHGtZfWB0HKhqehHnahMEUA/edit?usp=drivesdk
Taman Kanak Kanak Negeri Pati|https://docs.google.com/spreadsheets/d/15snxBqFX9CAq8msf2VtUC6JAvhuaPmj6KfLZu2G1mvE/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN BATANGAN|https://docs.google.com/spreadsheets/d/1tDgGqt1Ynen5Fr9RdOh4r5A5sF0ypnqWvT8olfGRU7s/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN CLUWAK|https://docs.google.com/spreadsheets/d/13iQo5QVvPMNZMbL0y7TIP2a5dCvS-rZ4IxyvmUqBLeY/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN DUKUHSETI|https://docs.google.com/spreadsheets/d/1vjfJUpGF4UYXqAkn6oEenq4zk2RJjag5eAVcoXiX3eo/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN GABUS|https://docs.google.com/spreadsheets/d/1sSX-WmuZpIoU2sO2o9oMFiKsrELfwkkPEkMw2gzS4rk/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN GEMBONG|https://docs.google.com/spreadsheets/d/1pNiHMCSJT9xkEqJA03eBYM2oZcCv0aamdb_6o8Z6zgE/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN GUNUNGWUNGKAL|https://docs.google.com/spreadsheets/d/1zyKnYPEgosAc4tVdcJFTlRKvM79hbEc_gq5LUN3afQs/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN JAKEN|https://docs.google.com/spreadsheets/d/1LN9oVb9wNLesq2skQfGhIOgo6qySRSTpswrxFSRXr-g/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN JAKENAN|https://docs.google.com/spreadsheets/d/173-HJjCvY0xktnY0k3EBuRr5isk-xGr8T_FyGyEtKEs/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN JUWANA|https://docs.google.com/spreadsheets/d/1kBGYcmdLk_b6jmIFWZ2hfssMRqbfNAplm3bJI1kHHsw/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN KAYEN|https://docs.google.com/spreadsheets/d/1tXOTc27gICRnf_OT4wQOUw4E7sTLIxU5HZmcYj0l2QA/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN MARGOREJO|https://docs.google.com/spreadsheets/d/1LpReba017LCIrBj4rvMxo4fI40TTOXeThM8p0a3Gluw/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN MARGOYOSO|https://docs.google.com/spreadsheets/d/1UMqbEsUSebSUdTEHwUzunygFrjrHxap1T8BC3erCWDs/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN PATI|https://docs.google.com/spreadsheets/d/19KC_I9YL38nsBePPDvfM8aH0AaqKFxpXqZMgkF-G7b4/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN PUCAKWANGI|https://docs.google.com/spreadsheets/d/1FF5P6_xWl7NhEdIQCqzzJ_2AU8hE0jfeLRawPD9uj1Y/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN SUKOLILO|https://docs.google.com/spreadsheets/d/13buC-Ps3mOZvyiHztLYjJHPpD83IDvtvFIR5mAimlkw/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN TAMBAKROMO|https://docs.google.com/spreadsheets/d/1tkYyViTUDev-PEmPaSxN-Q1XpFvXoI_RxIZfGt8u7tM/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN TAYU|https://docs.google.com/spreadsheets/d/1C5TPahQwQpZUcP9ujF60yLvN2H94vl6IzszTRnenYYE/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN TLOGOWUNGU|https://docs.google.com/spreadsheets/d/1zAYlUQoFo7GbsISWgVa1O7yCLvACyUigerKltP_bgcU/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN TRANGKIL|https://docs.google.com/spreadsheets/d/1DYDH8LoDI5NXPS5XWiHw2fslV306UnRuiSlfNbuAEzE/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN WEDARIJAKSA|https://docs.google.com/spreadsheets/d/1EhA45aRx4QkPPSSu5wmfUE4YHrtZ8PP9p1kpat8fRH0/edit?usp=drivesdk
UPTD PENDIDIKAN KECAMATAN WINONG|https://docs.google.com/spreadsheets/d/1Gz623OW4ZxyJAvqnJkMQCZTcqAwA8FUBC-D3ygpoh1M/edit?usp=drivesdk
UPTD PENDIDIKAN SMP BATANGAN|https://docs.google.com/spreadsheets/d/1FdlUT4t3sz6S19hoU-_r7KF6SE9iGuXP21uDywAepO4/edit?usp=drivesdk
UPTD PENDIDIKAN SMP CLUWAK|https://docs.google.com/spreadsheets/d/1SOubFcmHxhasmCdJBI4zzoQk3wEYYvwXChxaW8P3x_A/edit?usp=drivesdk
UPTD PENDIDIKAN SMP DUKUHSETI|https://docs.google.com/spreadsheets/d/1ID9oBaW2KcSjR-MYu4xIyW5FOy_l-BiVrviWz2_EkAk/edit?usp=drivesdk
UPTD PENDIDIKAN SMP GABUS|https://docs.google.com/spreadsheets/d/1x2tsRQYAnDQJBbS-Ov-HqmSL6fqDDQS1GHBirZYVc04/edit?usp=drivesdk
UPTD PENDIDIKAN SMP GEMBONG|https://docs.google.com/spreadsheets/d/16isFPuqH3KlJqztA0tGvNFTSe9EavdHXyX4f1470vlA/edit?usp=drivesdk
UPTD PENDIDIKAN SMP GUNUNGWUNGKAL|https://docs.google.com/spreadsheets/d/1GqV6z9DmdvSImRk1YZBqac9JVOG6dp9hJuoY1RFpACo/edit?usp=drivesdk
UPTD PENDIDIKAN SMP JAKEN|https://docs.google.com/spreadsheets/d/1cpRGxfCWJDUYsqWE-X7RvIAdiBuNL5qknE2sDmH36ow/edit?usp=drivesdk
UPTD PENDIDIKAN SMP JAKENAN|https://docs.google.com/spreadsheets/d/1rMJJJYLe4T_ZjR9rV3hewh6qDlCkk3ehlJJeJZ9QwJY/edit?usp=drivesdk
UPTD PENDIDIKAN SMP JUWANA|https://docs.google.com/spreadsheets/d/1_mPgXeDb0u0jsCgQV74owBKIoikFEStyXHk_zWWbwBk/edit?usp=drivesdk
UPTD PENDIDIKAN SMP KAYEN|https://docs.google.com/spreadsheets/d/196jQLqfxNzXQFWFtjxP-qd8keERi6igBObB64L0UTuQ/edit?usp=drivesdk
UPTD PENDIDIKAN SMP MARGOREJO|https://docs.google.com/spreadsheets/d/1krzF7vmuS3S76_fwdwzL7MZjl43DiQW24oFhKeUyd40/edit?usp=drivesdk
UPTD PENDIDIKAN SMP MARGOYOSO|https://docs.google.com/spreadsheets/d/1AWADj38omXYbnJL7b7pGf0HoeOq1ZyqqXWfElpRUkpQ/edit?usp=drivesdk
UPTD PENDIDIKAN SMP PATI|https://docs.google.com/spreadsheets/d/1sVdTLdrND65t1oY3Lkax6nwMlZ8ljjqzTJt75i3E26o/edit?usp=drivesdk
UPTD PENDIDIKAN SMP PUCAKWANGI|https://docs.google.com/spreadsheets/d/1hu99ZmKWBZFrE-4jNOxKMa_msZjCII8at96gEOZ5etE/edit?usp=drivesdk
UPTD PENDIDIKAN SMP SUKOLILO|https://docs.google.com/spreadsheets/d/17C5O_LmEs4evo8v23cwkhMGwzgahnyAnwbuvKBLYfH8/edit?usp=drivesdk
UPTD PENDIDIKAN SMP TAMBAKROMO|https://docs.google.com/spreadsheets/d/1_zWbQNrEqqvTCn57gd-CZWwEp1bxknJASItI-wm_yR4/edit?usp=drivesdk
UPTD PENDIDIKAN SMP TAYU|https://docs.google.com/spreadsheets/d/1mO0vYypzXNJnERUmWNt3ur3sGCHXlqmWXCnmqj4bobQ/edit?usp=drivesdk
UPTD PENDIDIKAN SMP TLOGOWUNGU|https://docs.google.com/spreadsheets/d/1y8MjfPV33nzPJ2cxYB0syYfPT1Xxpe0nTYQEsFrBQI8/edit?usp=drivesdk
UPTD PENDIDIKAN SMP TRANGKIL|https://docs.google.com/spreadsheets/d/13ZSqrMyMjqGDGVvgVTWdY3Pi_faw4OucBw1S03fNvUU/edit?usp=drivesdk
UPTD PENDIDIKAN SMP WEDARIJAKSA|https://docs.google.com/spreadsheets/d/1JdpqtJXOFy8KjUdrAWfRpww_IVDbN4d6-BF9hmZpgLU/edit?usp=drivesdk
UPTD PENDIDIKAN SMP WINONG|https://docs.google.com/spreadsheets/d/1ZVJA7xN2VVXPG1rNfJgUidiAqmXoh2WS5EyzB7s1tNk/edit?usp=drivesdk`.trim().split('\n').map(row => row.split('|')));

const OPD_DISPLAY_NAMES = Object.fromEntries(`Badan Kepegawaian Dan Pengembangan SDM|BKPSDM
Badan Kesatuan Bangsa dan Politik|Bakesbangpol
Badan Penanggulangan Bencana Daerah|BPBD
Badan Pengelolaan Keuangan dan Aset Daerah|BPKAD
Badan Perencanaan Pembangunan Riset dan Inovasi Daerah|BAPPERIDA
Dinas Kearsipan dan Perpustakaan|Arpusda
Dinas Kelautan dan Perikanan|DKP
Dinas Kepemudaan Olahraga dan Pariwisata|Dinporapar
Dinas Kependudukan dan Pencatatan Sipil|Disdukcapil
Dinas Kesehatan|Dinkes
Dinas Ketahanan Pangan|Disketapang
Dinas Komunikasi dan Informatika|Diskominfo
Dinas Koperasi, Usaha Mikro, Kecil dan Menengah|Dinkop
Dinas Lingkungan Hidup|DLH
Dinas Pekerjaan Umum dan Penataan Ruang|DPUTR
Dinas Pemberdayaan Masyarakat dan Desa|Dispermades
Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu|DPMPTSP
Dinas Pendidikan dan Kebudayaan|Disdikbud
Dinas Perdagangan dan Perindustrian|Disdagperin
Dinas Perhubungan|Dishub
Dinas Pertanian|Dispertan
Dinas Perumahan dan Kawasan Pemukiman|Disperkim
Dinas Sosial P3AKB|Dinsos
Dinas Tenaga Kerja|Disnaker
GUDANG FARMASI|Gudang Farmasi
Inspektorat Daerah|Inspektorat
Kecamatan Batangan|Kec. Batangan
Kecamatan Cluwak|Kec. Cluwak
Kecamatan Dukuhseti|Kec. Dukuhseti
Kecamatan Gabus|Kec. Gabus
Kecamatan Gembong|Kec. Gembong
Kecamatan Gunungwungkal|Kec. Gunungwungkal
Kecamatan Jaken|Kec. Jaken
Kecamatan Jakenan|Kec. Jakenan
Kecamatan Juwana|Kec. Juwana
Kecamatan Kayen|Kec. Kayen
Kecamatan Margorejo|Kec. Margorejo
Kecamatan Margoyoso|Kec. Margoyoso
Kecamatan Pati|Kec. Pati
Kecamatan Pucakwangi|Kec. Pucakwangi
Kecamatan Sukolilo|Kec. Sukolilo
Kecamatan Tambakromo|Kec. Tambakromo
Kecamatan Tayu|Kec. Tayu
Kecamatan Tlogowungu|Kec. Tlogowungu
Kecamatan Trangkil|Kec. Trangkil
Kecamatan Wedarijaksa|Kec. Wedarijaksa
Kecamatan Winong|Kec. Winong
Kelurahan Kalidoro|Kel. Kalidoro
Kelurahan Parenggan|Kel. Parenggan
Kelurahan Pati Kidul|Kel. Pati Kidul
Kelurahan Pati Lor|Kel. Pati Lor
Kelurahan Pati Wetan|Kel. Pati Wetan
LABKESDA|Labkesda
PUSKESMAS BATANGAN I|Puskesmas Batangan I
PUSKESMAS CLUWAK I|Puskesmas Cluwak I
PUSKESMAS DUKUHSETI|Puskesmas Dukuhseti
PUSKESMAS GABUS I|Puskesmas Gabus I
PUSKESMAS GABUS II|Puskesmas Gabus II
PUSKESMAS GEMBONG I|Puskesmas Gembong I
PUSKESMAS GUNUNGWUNGKAL|Puskesmas Gunungwungkal
PUSKESMAS JAKEN I|Puskesmas Jaken I
PUSKESMAS JAKENAN I|Puskesmas Jakenan I
PUSKESMAS JUWANA|Puskesmas Juwana
PUSKESMAS KAYEN|Puskesmas Kayen
PUSKESMAS MARGOREJO I|Puskesmas Margorejo I
PUSKESMAS MARGOYOSO I|Puskesmas Margoyoso I
PUSKESMAS MARGOYOSO II|Puskesmas Margoyoso II
PUSKESMAS PATI I|Puskesmas Pati I
PUSKESMAS PATI II|Puskesmas Pati II
PUSKESMAS PUCAKWANGI I|Puskesmas Pucakwangi I
PUSKESMAS PUCAKWANGI II|Puskesmas Pucakwangi II
PUSKESMAS SUKOLILO I|Puskesmas Sukolilo I
PUSKESMAS SUKOLILO II|Puskesmas Sukolilo II
PUSKESMAS TAMBAKROMO|Puskesmas Tambakromo
PUSKESMAS TAYU I|Puskesmas Tayu I
PUSKESMAS TAYU II|Puskesmas Tayu II
PUSKESMAS TLOGOWUNGU|Puskesmas Tlogowungu
PUSKESMAS TRANGKIL I|Puskesmas Trangkil I
PUSKESMAS WEDARIJAKSA I|Puskesmas Wedarijaksa I
PUSKESMAS WEDARIJAKSA II|Puskesmas Wedarijaksa II
PUSKESMAS WINONG I|Puskesmas Winong I
PUSKESMAS WINONG II|Puskesmas Winong II
Rumah Sakit Umum Daerah Kayen|RSUD Kayen
Rumah Sakit Umum Daerah RAA Soewondo|RSUD Soewondo
SANGGAR KEGIATAN BELAJAR KAB. PATI|SKB
Satuan Polisi Pamong Praja|Satpol PP
Sekretariat Daerah|Setda
Sekretariat DPRD|Setwan
Taman Kanak Kanak Negeri Pati|TKK
UPTD PENDIDIKAN KECAMATAN BATANGAN|Korwilcam Batangan
UPTD PENDIDIKAN KECAMATAN CLUWAK|Korwilcam Cluwak
UPTD PENDIDIKAN KECAMATAN DUKUHSETI|Korwilcam Dukuhseti
UPTD PENDIDIKAN KECAMATAN GABUS|Korwilcam Gabus
UPTD PENDIDIKAN KECAMATAN GEMBONG|Korwilcam Gembong
UPTD PENDIDIKAN KECAMATAN GUNUNGWUNGKAL|Korwilcam Gunungwungkal
UPTD PENDIDIKAN KECAMATAN JAKEN|Korwilcam Jaken
UPTD PENDIDIKAN KECAMATAN JAKENAN|Korwilcam Jakenan
UPTD PENDIDIKAN KECAMATAN JUWANA|Korwilcam Juwana
UPTD PENDIDIKAN KECAMATAN KAYEN|Korwilcam Kayen
UPTD PENDIDIKAN KECAMATAN MARGOREJO|Korwilcam Margorejo
UPTD PENDIDIKAN KECAMATAN MARGOYOSO|Korwilcam Margoyoso
UPTD PENDIDIKAN KECAMATAN PATI|Korwilcam Pati
UPTD PENDIDIKAN KECAMATAN PUCAKWANGI|Korwilcam Pucakwangi
UPTD PENDIDIKAN KECAMATAN SUKOLILO|Korwilcam Sukolilo
UPTD PENDIDIKAN KECAMATAN TAMBAKROMO|Korwilcam Tambakromo
UPTD PENDIDIKAN KECAMATAN TAYU|Korwilcam Tayu
UPTD PENDIDIKAN KECAMATAN TLOGOWUNGU|Korwilcam Tlogowungu
UPTD PENDIDIKAN KECAMATAN TRANGKIL|Korwilcam Trangkil
UPTD PENDIDIKAN KECAMATAN WEDARIJAKSA|Korwilcam Wedarijaksa
UPTD PENDIDIKAN KECAMATAN WINONG|Korwilcam Winong
UPTD PENDIDIKAN SMP BATANGAN|SMP Batangan
UPTD PENDIDIKAN SMP CLUWAK|SMP Cluwak
UPTD PENDIDIKAN SMP DUKUHSETI|SMP Dukuhseti
UPTD PENDIDIKAN SMP GABUS|SMP Gabus
UPTD PENDIDIKAN SMP GEMBONG|SMP Gembong
UPTD PENDIDIKAN SMP GUNUNGWUNGKAL|SMP Gunungwungkal
UPTD PENDIDIKAN SMP JAKEN|SMP Jaken
UPTD PENDIDIKAN SMP JAKENAN|SMP Jakenan
UPTD PENDIDIKAN SMP JUWANA|SMP Juwana
UPTD PENDIDIKAN SMP KAYEN|SMP Kayen
UPTD PENDIDIKAN SMP MARGOREJO|SMP Margorejo
UPTD PENDIDIKAN SMP MARGOYOSO|SMP Margoyoso
UPTD PENDIDIKAN SMP PATI|SMP Pati
UPTD PENDIDIKAN SMP PUCAKWANGI|SMP Pucakwangi
UPTD PENDIDIKAN SMP SUKOLILO|SMP Sukolilo
UPTD PENDIDIKAN SMP TAMBAKROMO|SMP Tambakromo
UPTD PENDIDIKAN SMP TAYU|SMP Tayu
UPTD PENDIDIKAN SMP TLOGOWUNGU|SMP Tlogowungu
UPTD PENDIDIKAN SMP TRANGKIL|SMP Trangkil
UPTD PENDIDIKAN SMP WEDARIJAKSA|SMP Wedarijaksa
UPTD PENDIDIKAN SMP WINONG|SMP Winong`.trim().split('\n').map(row => row.split('|')));

const PORTAL_CONFIG = {
  opd: [
    'Badan Kepegawaian Dan Pengembangan SDM','Badan Kesatuan Bangsa dan Politik','Badan Penanggulangan Bencana Daerah','Badan Pengelolaan Keuangan dan Aset Daerah','Badan Perencanaan Pembangunan Riset dan Inovasi Daerah','Dinas Kearsipan dan Perpustakaan','Dinas Kelautan dan Perikanan','Dinas Kepemudaan Olahraga dan Pariwisata','Dinas Kependudukan dan Pencatatan Sipil','Dinas Kesehatan','Dinas Ketahanan Pangan','Dinas Komunikasi dan Informatika','Dinas Koperasi, Usaha Mikro, Kecil dan Menengah','Dinas Lingkungan Hidup','Dinas Pekerjaan Umum dan Penataan Ruang','Dinas Pemberdayaan Masyarakat dan Desa','Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu','Dinas Pendidikan dan Kebudayaan','Dinas Perdagangan dan Perindustrian','Dinas Perhubungan','Dinas Pertanian','Dinas Perumahan dan Kawasan Pemukiman','Dinas Sosial P3AKB','Dinas Tenaga Kerja','GUDANG FARMASI','Inspektorat Daerah',
    'Kecamatan Batangan','Kecamatan Cluwak','Kecamatan Dukuhseti','Kecamatan Gabus','Kecamatan Gembong','Kecamatan Gunungwungkal','Kecamatan Jaken','Kecamatan Jakenan','Kecamatan Juwana','Kecamatan Kayen','Kecamatan Margorejo','Kecamatan Margoyoso','Kecamatan Pati','Kecamatan Pucakwangi','Kecamatan Sukolilo','Kecamatan Tambakromo','Kecamatan Tayu','Kecamatan Tlogowungu','Kecamatan Trangkil','Kecamatan Wedarijaksa','Kecamatan Winong',
    'Kelurahan Kalidoro','Kelurahan Parenggan','Kelurahan Pati Kidul','Kelurahan Pati Lor','Kelurahan Pati Wetan','LABKESDA','PUSKESMAS BATANGAN I','PUSKESMAS CLUWAK I','PUSKESMAS DUKUHSETI','PUSKESMAS GABUS I','PUSKESMAS GABUS II','PUSKESMAS GEMBONG I','PUSKESMAS GUNUNGWUNGKAL','PUSKESMAS JAKEN I','PUSKESMAS JAKENAN I','PUSKESMAS JUWANA','PUSKESMAS KAYEN','PUSKESMAS MARGOREJO I','PUSKESMAS MARGOYOSO I','PUSKESMAS MARGOYOSO II','PUSKESMAS PATI I','PUSKESMAS PATI II','PUSKESMAS PUCAKWANGI I','PUSKESMAS PUCAKWANGI II','PUSKESMAS SUKOLILO I','PUSKESMAS SUKOLILO II','PUSKESMAS TAMBAKROMO','PUSKESMAS TAYU I','PUSKESMAS TAYU II','PUSKESMAS TLOGOWUNGU','PUSKESMAS TRANGKIL I','PUSKESMAS WEDARIJAKSA I','PUSKESMAS WEDARIJAKSA II','PUSKESMAS WINONG I','PUSKESMAS WINONG II',
    'Rumah Sakit Umum Daerah Kayen','Rumah Sakit Umum Daerah RAA Soewondo','SANGGAR KEGIATAN BELAJAR KAB. PATI','Satuan Polisi Pamong Praja','Sekretariat Daerah','Sekretariat DPRD','Taman Kanak Kanak Negeri Pati',
    'UPTD PENDIDIKAN KECAMATAN BATANGAN','UPTD PENDIDIKAN KECAMATAN CLUWAK','UPTD PENDIDIKAN KECAMATAN DUKUHSETI','UPTD PENDIDIKAN KECAMATAN GABUS','UPTD PENDIDIKAN KECAMATAN GEMBONG','UPTD PENDIDIKAN KECAMATAN GUNUNGWUNGKAL','UPTD PENDIDIKAN KECAMATAN JAKEN','UPTD PENDIDIKAN KECAMATAN JAKENAN','UPTD PENDIDIKAN KECAMATAN JUWANA','UPTD PENDIDIKAN KECAMATAN KAYEN','UPTD PENDIDIKAN KECAMATAN MARGOREJO','UPTD PENDIDIKAN KECAMATAN MARGOYOSO','UPTD PENDIDIKAN KECAMATAN PATI','UPTD PENDIDIKAN KECAMATAN PUCAKWANGI','UPTD PENDIDIKAN KECAMATAN SUKOLILO','UPTD PENDIDIKAN KECAMATAN TAMBAKROMO','UPTD PENDIDIKAN KECAMATAN TAYU','UPTD PENDIDIKAN KECAMATAN TLOGOWUNGU','UPTD PENDIDIKAN KECAMATAN TRANGKIL','UPTD PENDIDIKAN KECAMATAN WEDARIJAKSA','UPTD PENDIDIKAN KECAMATAN WINONG',
    'UPTD PENDIDIKAN SMP BATANGAN','UPTD PENDIDIKAN SMP CLUWAK','UPTD PENDIDIKAN SMP DUKUHSETI','UPTD PENDIDIKAN SMP GABUS','UPTD PENDIDIKAN SMP GEMBONG','UPTD PENDIDIKAN SMP GUNUNGWUNGKAL','UPTD PENDIDIKAN SMP JAKEN','UPTD PENDIDIKAN SMP JAKENAN','UPTD PENDIDIKAN SMP JUWANA','UPTD PENDIDIKAN SMP KAYEN','UPTD PENDIDIKAN SMP MARGOREJO','UPTD PENDIDIKAN SMP MARGOYOSO','UPTD PENDIDIKAN SMP PATI','UPTD PENDIDIKAN SMP PUCAKWANGI','UPTD PENDIDIKAN SMP SUKOLILO','UPTD PENDIDIKAN SMP TAMBAKROMO','UPTD PENDIDIKAN SMP TAYU','UPTD PENDIDIKAN SMP TLOGOWUNGU','UPTD PENDIDIKAN SMP TRANGKIL','UPTD PENDIDIKAN SMP WEDARIJAKSA','UPTD PENDIDIKAN SMP WINONG'
  ].map(name => ({name: OPD_DISPLAY_NAMES[name] || name, url: KERTAS_KERJA_URL[name] || ''})),
  // Endpoint Apps Script pelaporan Triwulan I.
  uploadEndpoint: 'https://script.google.com/macros/s/AKfycbwU7bIGotLOEwjw_kJjZo321tNHR2Y0BIBeg7mWumTCYLEKLG_1xHjnCVL1NpXlsC0m/exec',
  // Isi setelah Apps Script pada folder apps-script dideploy sebagai Web App.
  uploadEndpointTriwulanII: 'https://script.google.com/macros/s/AKfycbzQLO--GbMXBfIjylriAJxeIHvvjrzaBVdMgn8En3LYizHuCMxG2Fea1gwRNDKu8I-Z/exec'
};

function renderOpdList() {
  const grid = document.querySelector('[data-opd-grid]');
  if (!grid) return;
  const count = document.querySelector('[data-opd-count]');
  const search = document.querySelector('[data-opd-search]');
  const draw = () => {
    const query = (search?.value || '').toLowerCase().trim();
    const rows = PORTAL_CONFIG.opd.filter(item => item.name.toLowerCase().includes(query));
    grid.innerHTML = rows.map(item => item.url
      ? `<a class="opd-link" href="${item.url}" target="_blank" rel="noopener"><span>${item.name}</span><i class="bx bx-link-external"></i></a>`
      : `<span class="opd-link disabled" title="Tautan Google Sheet belum diatur"><span>${item.name}</span><i class="bx bx-time-five"></i></span>`).join('');
    count.textContent = `${rows.length} perangkat daerah ditampilkan`;
  };
  search?.addEventListener('input', draw); draw();
}

function fillOpdSelect() {
  document.querySelectorAll('[data-opd-select]').forEach(select => {
    PORTAL_CONFIG.opd.forEach(({name}) => select.insertAdjacentHTML('beforeend', `<option value="${name}">${name}</option>`));
  });
}

function bindForm() {
  const form = document.querySelector('[data-report-form]');
  if (!form) return;
  const email = form.elements.email;
  const validateEmail = () => {
    const value = email.value.trim();
    email.setCustomValidity(value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? 'Masukkan alamat email yang valid.' : '');
  };
  email.addEventListener('input', validateEmail);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    validateEmail();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const message = form.querySelector('.form-message');
    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof File) data[key] = value.size ? await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({name:value.name,type:value.type,data:reader.result}); reader.onerror = reject; reader.readAsDataURL(value); }) : null;
    }
    data.jenis = form.dataset.type;
    data.triwulan = form.dataset.period;
    const endpoint = data.triwulan === 'II' ? PORTAL_CONFIG.uploadEndpointTriwulanII : PORTAL_CONFIG.uploadEndpoint;
    if (!endpoint || endpoint.includes('PASTE_URL_WEB_APP')) {
      alert('Layanan upload Triwulan II belum diaktifkan. Hubungi admin portal.');
      return;
    }
    button.disabled = true; button.textContent = 'Mengirim...';
    try {
      // Endpoint Apps Script contoh menerima metadata. Sesuaikan Apps Script jika file perlu ikut disimpan ke Drive.
      await fetch(endpoint, {method:'POST', mode:'no-cors', body:JSON.stringify(data)});
      message.innerHTML = '<i class="bx bx-check-circle"></i> Dokumen berhasil dikirim.';
      message.style.display = 'block'; form.reset();
    } catch (_) { alert('Pengiriman belum berhasil. Silakan coba kembali atau hubungi admin.'); }
    button.disabled = false; button.innerHTML = 'Kirim Dokumen <i class="bx bx-send"></i>';
  });
}
function pageContext() {
  const params = new URLSearchParams(location.search);
  const period = params.get('triwulan') === 'II' ? 'II' : 'I';
  const type = params.get('jenis') || 'aset-tetap';
  if (type === 'penyusutan' && period === 'I') {
    location.replace('pelaporan.html?triwulan=I');
    return;
  }
  const labels = {'aset-tetap':'Aset Tetap',persediaan:'Persediaan',penyusutan:'Penyusutan'};
  document.querySelectorAll('[data-period]').forEach(el => el.textContent = `Triwulan ${period}`);
  document.querySelectorAll('[data-opd-search]').forEach(el => el.placeholder = 'Cari nama perangkat daerah');
  document.querySelectorAll('[data-type]').forEach(el => el.textContent = labels[type] || type);
  const form = document.querySelector('[data-report-form]');
  if (form) { form.dataset.period = period; form.dataset.type = labels[type] || type; }
  const requirements = document.querySelector('[data-requirements]');
  if (requirements) {
    const periodLabel = `TW ${period} 2026`;
    const files = type === 'aset-tetap' ? [
      {key:'suratPengantar',name:`Surat Pengantar Laporan BMD Triwulan ${period} 2026`},
      {key:'baInternal',name:`BA Rekonsiliasi Aset Tetap Internal ${periodLabel}`},
      {key:'baEksternal',name:`BA Rekonsiliasi Aset Tetap Eksternal ${periodLabel}`},
      {key:'hibah',name:'BAST Hibah',optional:'Jika terdapat Hibah'},
      {key:'reklas',name:'Surat Reklasifikasi BMD',optional:'Jika terdapat Reklasifikasi BMD'}
    ] : type === 'persediaan' ? [
      {key:'baInternalPersediaan',name:`BA Rekonsiliasi Persediaan Internal ${periodLabel}`},
      {key:'baEksternalPersediaan',name:`BA Rekonsiliasi Persediaan Eksternal ${periodLabel}`},
      {key:'stockOpname',name:`Laporan Stock Opname dari Sibaper ${periodLabel}`},
      {key:'mutasi',name:`Rekap Mutasi Persediaan dari Sibaper ${periodLabel}`}
    ] : period === 'II' ? [
      {key:'laporanPenyusutan',name:'Laporan Penyusutan Aset Tetap Semester I 2026'},
      {key:'laporanAmortisasi',name:'Laporan Amortisasi Aset Tak Berwujud Semester I 2026'}
    ] : [];
    requirements.innerHTML = files.map((file,index) => `<div class="field full"><label for="file${index}">${file.name}${file.optional ? ` (${file.optional})` : ' *'}</label><input id="file${index}" name="${file.key}" type="file" accept="application/pdf,.pdf" ${file.optional ? '' : 'required'}><span class="hint">Unggah dalam format PDF.</span></div>`).join('');
  }
}
document.addEventListener('DOMContentLoaded', () => { pageContext(); renderOpdList(); fillOpdSelect(); bindForm(); });
