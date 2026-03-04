import { ScrollView, View, StyleSheet } from 'react-native';

import Header from '../../components/profile/Header';
import ProfileHeader from '../../components/ProfileHeader';
import SectionTitle from '../../components/profile/SectionTitle';
import ExperienceCard from '../../components/profile/ExperienceCard';
import CurriculumCard from '../../components/profile/CurriculumCard';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Header />

      <ScrollView style={styles.content}>
        <ProfileHeader />

        <View style={styles.inner}>
          <SectionTitle title="Sobre" />

          <SectionTitle title="Experiência" showAdd />
          <ExperienceCard
            title="Vaga"
            company="Empresa"
            city="Osasco, SP"
          />
          <ExperienceCard
            title="Vaga"
            company="Empresa"
            city="Osasco, SP"
          />

          <SectionTitle title="Currículo" />
          <CurriculumCard />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  inner: {
    padding: 20,
  },
});