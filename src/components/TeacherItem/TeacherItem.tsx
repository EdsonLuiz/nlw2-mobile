import React, {useState} from 'react'
import {View, Text, Image, Linking} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import styles from './styles'
import {RectButton} from 'react-native-gesture-handler'

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png'
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png'
import whatsappIcon from '../../assets/images/icons/whatsapp.png'
import api from '../../services/api'

export interface Teacher {
  id: number;
  subject: string;
  name: string;
  cost: number;
  avatar: string;
  whatsapp: string;
  bio: string;
}

interface TeacherItemProps {
  teacher: Teacher
  favorited: boolean;
}

const TeacherItem:React.FC<TeacherItemProps> = ({teacher, favorited}) => {

  const [isFavorited, setIsFavorited] = useState(favorited)

  async function handleToggleFavorite() {
    const allFavorites = await AsyncStorage.getItem('@proffy:favorites')

    let favoritesArray = []

    if(allFavorites) {
      favoritesArray = JSON.parse(allFavorites)
    }

    if(isFavorited) {
      const favoriteIndex = favoritesArray.findIndex((teacherItem: Teacher) => {
        return  teacherItem.id === teacher.id
      })

      favoritesArray.splice(favoriteIndex, 1)
      setIsFavorited(false)

    } else {
      favoritesArray.push(teacher)
      setIsFavorited(true)
    }
    await AsyncStorage.setItem('@proffy:favorites', JSON.stringify(favoritesArray)) 
  }

  function  handleLinkToWhatsapp() {
    api.post('connections', {
      user_id: teacher.id 
    })
    Linking.openURL(`whatsapp://ssend?phone=${teacher.whatsapp}`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
            style={styles.avatar}
          source={{uri: teacher.avatar}} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.subject}>{teacher.subject}</Text>
        </View>
      </View>

      <Text style={styles.bio}>{teacher.bio}</Text>

      <View style={styles.footer}>
        <Text style={styles.price}>
          Preço/hora {'    '}
          <Text style={styles.priceValue}>R$ {teacher.cost}</Text>
        </Text>

        <View style={styles.buttonsContainer}>
          <RectButton 
            onPress={handleToggleFavorite}
            style={[ 
              styles.favoriteButton, 
              isFavorited ? styles.favorited : {} 
            ]}>
            { isFavorited 
                ? <Image source={unfavoriteIcon} /> 
                : <Image source={heartOutlineIcon} /> 
            }
                       
          </RectButton>

          <RectButton onPress={handleLinkToWhatsapp} style={styles.contactButton}>
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>

    </View>
  )
}

export default TeacherItem
