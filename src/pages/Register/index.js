import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Image,
    Animated,
    ImageBackground,
    TouchableWithoutFeedback,
    TouchableOpacity,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { MyButton, MyCalendar, MyGap, MyHeader, MyInput, MyPicker } from '../../components';
import { MyDimensi, colors, fonts, windowHeight, windowWidth, Color } from '../../utils';
import { MYAPP, apiURL, api_token, getData, storeData } from '../../utils/localStorage';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { color } from 'react-native-reanimated';
import axios from 'axios';
import moment from 'moment';
import { useToast } from 'react-native-toast-notifications';
import MyLoading from '../../components/MyLoading';

export default function Register({ navigation, route }) {
    const [loading, setLoading] = useState(false)
    const img = new Animated.Value(0.8);
    const card = new Animated.Value(50);
    const toast = useToast();
    Animated.timing(img, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
    }).start();
    Animated.timing(card, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
    }).start();
    const [kirim, setKirim] = useState({
        api_token: api_token,
        username: '',
        nama_lengkap: '',
        jenis_kelamin: 'Laki-laki',
        tanggal_lahir: moment().format('YYYY-MM-DD'),
        telepon: '',
        password: '',
        repassword: '',

    });

    const simpan = () => {



        if (
            kirim.nama_lengkap.length === 0 &&
            kirim.username.length === 0 &&
            kirim.password.length === 0

        ) {
            toast.show('Formulir pendaftaran tidak boleh kosong', {
                type: 'warning'
            })
        } else if (kirim.nama_lengkap.length === 0) {
            toast.show('Silahkan ketikan nama lengkap', {
                type: 'warning'
            })
        }

        else if (kirim.username.length === 0) {
            showMessage({
                message: 'Masukan username',
            });
        }
        else if (kirim.password.length === 0) {
            showMessage({
                message: 'Masukan kata sandi kamu',
            });
        } else if (kirim.repassword.length === 0) {
            showMessage({
                message: 'Ulangi kata sandi kamu',
            });
        } else {

            console.log(kirim);

            setLoading(true);
            axios
                .post(apiURL + 'register', kirim)
                .then(res => {
                    console.warn(res.data);
                    setLoading(false);
                    if (res.data.status == 404) {
                        toast.show(res.data.message, {
                            type: 'danger'
                        })

                    } else {
                        toast.show(res.data.message, {
                            type: 'success'
                        });
                        storeData('user', res.data.data);
                        navigation.replace('MainApp');

                    }


                });
        }
    };




    useEffect(() => {


        axios.post(apiURL + 'company').then(res => {
            setComp(res.data.data);
        })
    }, []);
    const [sama, setSama] = useState(true)

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.tertiary,
        }}>
            {/* <MyHeader title="Daftar Akun" /> */}

            <ScrollView showsVerticalScrollIndicator={false}>



                <View style={{
                    borderRadius: 12,
                    margin: 16,
                    padding: 20,
                    backgroundColor: colors.white
                }}>

                    <Text style={{
                        ...fonts.headline2,
                        color: Color.secondary[900],
                        textAlign: 'center',
                        marginBottom: 2
                    }}>Ayo bergabung bersama kami</Text>
                    <Text style={{
                        ...fonts.body3,
                        color: Color.secondary[900],
                        textAlign: 'center',
                        marginTop: 2,
                    }}>Lengkapi data untuk mendaftar</Text>

                    <MyGap jarak={24} />
                    {/* NAMA LENGKAP */}
                    <MyInput label='Nama Lengkap' onChangeText={x => {
                        setKirim({
                            ...kirim,
                            nama_lengkap: x
                        })
                    }} iconname='person-outline' placeholder='Ketikan nama lengkap' />
                    <MyGap jarak={20} />


                    <MyInput label='Username' onChangeText={x => {
                        setKirim({
                            ...kirim,
                            username: x
                        })
                    }} iconname='at-outline' placeholder='Ketikan username' />
                    <MyGap jarak={20} />


                    <MyPicker iconname='male-female-outline' data={[
                        { label: 'Laki-laki', value: 'Laki-laki' },
                        { label: 'Perempuan', value: 'Perempuan' },
                    ]} label="Jenis Kelamin" onValueChange={x => {
                        setKirim({
                            ...kirim,
                            jenis_kelamin: x
                        })
                    }} />
                    <MyGap jarak={20} />

                    <MyCalendar label={'Tanggal Lahir ( ' + moment().diff(kirim.tanggal_lahir, 'years') + ' Tahun )'} onDateChange={x => {
                        setKirim({
                            ...kirim,
                            tanggal_lahir: x
                        })
                    }} value={kirim.tanggal_lahir} />

                    <MyGap jarak={20} />

                    <MyInput label='Nomor Telepon' onChangeText={x => {
                        setKirim({
                            ...kirim,
                            telepon: x
                        })
                    }} iconname='call-outline' keyboardType='phone-pad' placeholder='Ketikan nomor telepon' />

                    <MyGap jarak={20} />
                    {/*INPUT KATA SANDI */}
                    <MyInput
                        placeholder="Ketikan kata sandi"
                        label="Kata Sandi"
                        iconname="lock-closed-outline"
                        value={kirim.password}
                        secureTextEntry={true}
                        onChangeText={value =>
                            setKirim({
                                ...kirim,
                                password: value,
                            })
                        }
                    />


                    {/* INPUT KATA SANDI ULANG */}
                    <MyGap jarak={20} />
                    <MyInput
                        borderColor={sama ? Color.blueGray[300] : colors.danger}

                        placeholder="Ketikan ulang kata sandi"
                        label="Ketikan ulang kata sandi"
                        iconname="lock-closed-outline"
                        secureTextEntry
                        value={kirim.repassword}
                        onChangeText={value => {

                            if (value !== kirim.password) {
                                setSama(false)
                            } else {
                                setSama(true)
                            }

                            setKirim({
                                ...kirim,
                                repassword: value,
                            })
                        }

                        }
                    />
                    <MyGap jarak={20} />

                    {!loading &&
                        <>
                            <MyButton

                                warna={colors.secondary}
                                title="Daftar"
                                Icons="log-in"
                                onPress={simpan}
                            />

                            <MyGap jarak={12} />
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={{
                                    ...fonts.body3,
                                    color: Color.blueGray[400],
                                    textAlign: 'center'
                                }}>
                                    Saya sudah memiliki akun? <Text style={{
                                        ...fonts.headline5,
                                        color: Color.primary[900],
                                        textAlign: 'center'
                                    }}>
                                        Masuk Sekarang!
                                    </Text>
                                </Text>
                            </TouchableOpacity>

                        </>
                    }

                    {loading && <MyLoading />}

                </View>


            </ScrollView>


        </SafeAreaView >
    );
}

const styles = StyleSheet.create({});
