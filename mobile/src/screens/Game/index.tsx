import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, FlatList,Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { GameParams } from '../../@types/navigation';
import { Background } from '../../components/Background';
import { styles } from './styles';
import {Entypo} from '@expo/vector-icons'
import { THEME } from '../../theme';
import logoImg from '../../assets/logo-nlw-esports.png'
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { DuoMatch } from '../../components/DuoMatch';

export function Game() {
  const route = useRoute()
  const game = route.params as GameParams
  const navigation = useNavigation()
  const [duos, setDuos] = useState<DuoCardProps[]>([])
  const [discordSelected, setDiscordSelected] = useState<string>('')

  function handleGoBack() {
    navigation.goBack()
  }

  useEffect(() => {
    fetch(`http://192.168.100.73:3333/games/${game.id}/ads`)
    .then(res => res.json())
    .then(data => setDuos(data))
  }, []);

  async function getDiscord(adsId:string) {
    fetch(`http://192.168.100.73:3333/ads/${adsId}/discord`)
    .then(res => res.json())
    .then(data => setDiscordSelected(data.discord))
  }
  
  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo 
              name='chevron-thin-left'
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image 
            source={logoImg}
            style={styles.logo}
          />
          <View style={styles.right}/>
        </View>
        <Image source={{uri: game.bannerUrl}} style={styles.cover} resizeMode="cover"/>
        <Heading title={game.title} subtitle={'Conecte-se e comece a jogar!'} />
        <FlatList 
          data={duos} 
          keyExtractor={item => item.id} 
          renderItem={({item}) => <DuoCard data={item} onConnect={() => getDiscord(item.id)}/>}
          horizontal
          contentContainerStyle={[
            duos.length > 0
            ? styles.contentList 
            : {
              flex:1, 
              justifyContent:'center', 
              alignItems: 'center'
            }
          ]}
          style={styles.containerList}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => <Text>Não há anúncios publicados ainda.</Text>}
        />
        <DuoMatch 
          visible={discordSelected.length > 0} 
          discord={discordSelected}
          onClose={() => setDiscordSelected('')}
        />
      </SafeAreaView> 
    </Background>
  );
}