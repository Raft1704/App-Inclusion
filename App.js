import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Vibration, Alert, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [score, setScore] = useState(0);

  // --- LÓGICA SIMÓN DICE (CORREGIDA) ---
  const [simonSeq, setSimonSeq] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [isShowing, setIsShowing] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  
  const patterns = [[0, 200], [0, 600], [0, 100, 50, 100]];

  const startSimon = () => {
    setScore(0);
    setUserSeq([]);
    setGameActive(true);
    const firstStep = Math.floor(Math.random() * 3);
    const newSeq = [firstStep];
    setSimonSeq(newSeq);
    reproducir(newSeq);
  };

  const reproducir = async (sequence) => {
    setIsShowing(true);
    for (const step of sequence) {
      Vibration.vibrate(patterns[step]);
      await new Promise(r => setTimeout(r, 900));
    }
    setIsShowing(false);
    setUserSeq([]);
  };

  const pressSimon = (id) => {
    if (isShowing || !gameActive) return;
    
    Vibration.vibrate(patterns[id]);
    const nextUserSeq = [...userSeq, id];
    setUserSeq(nextUserSeq);

    if (id !== simonSeq[nextUserSeq.length - 1]) {
      Vibration.vibrate([0, 500]); // Vibración de error
      Alert.alert("¡Fin del juego!", `Puntaje final: ${score}`, [
        { text: "Reintentar", onPress: () => startSimon() }
      ]);
      setGameActive(false);
      setSimonSeq([]);
    } else if (nextUserSeq.length === simonSeq.length) {
      setScore(s => s + 1);
      const nextSeq = [...simonSeq, Math.floor(Math.random() * 3)];
      setSimonSeq(nextSeq);
      setTimeout(() => reproducir(nextSeq), 1000);
    }
  };

  // --- LÓGICA BOTÓN FUGAZ ---
  const [pos, setPos] = useState({ top: 200, left: 100 });
  const moverFugaz = () => {
    setPos({
      top: Math.floor(Math.random() * (height - 250)) + 80,
      left: Math.floor(Math.random() * (width - 120)) + 20
    });
    setScore(s => s + 1);
    Vibration.vibrate(70);
  };

  // --- RENDERIZADO ---
  if (screen === 'simon') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Simón Táctil</Text>
        <Text style={styles.scoreText}>Nivel: {score}</Text>
        
        <View style={styles.grid}>
          {['#FF5252', '#4CAF50', '#2196F3'].map((color, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => pressSimon(i)} 
              activeOpacity={0.6}
              style={[styles.btn, {backgroundColor: color, opacity: isShowing || !gameActive ? 0.4 : 1}]} 
            />
          ))}
        </View>

        {!gameActive && (
          <TouchableOpacity onPress={startSimon} style={styles.startBtn}>
            <Text style={styles.menuText}>EMPEZAR</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => {setGameActive(false); setSimonSeq([]); setScreen('menu');}}>
          <Text style={styles.back}>VOLVER AL MENÚ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'motriz') {
    return (
      <View style={styles.gameCanvas}>
        <Text style={styles.scoreTop}>Aciertos: {score}</Text>
        <TouchableOpacity activeOpacity={1} onPress={moverFugaz} style={[styles.target, { top: pos.top, left: pos.left }]}>
          <Text style={styles.targetText}>TOCAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitBtn} onPress={() => {setScore(0); setScreen('menu');}}><Text style={styles.exitText}>SALIR</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incluso-App</Text>
      <Text style={styles.subtitle}>Desafíos de Sensibilización</Text>
      
      <TouchableOpacity style={styles.menuBtn} onPress={() => {setScore(0); setScreen('simon');}}>
        <Text style={styles.menuText}>🔈 DESAFÍO AUDITIVO</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.menuBtn, {marginTop: 20, backgroundColor: '#E94E77'}]} onPress={() => {setScore(0); setScreen('motriz');}}>
        <Text style={styles.menuText}>✋ DESAFÍO MOTRIZ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 20 },
  gameCanvas: { flex: 1, backgroundColor: '#000' },
  title: { fontSize: 32, color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  subtitle: { color: '#666', marginBottom: 40 },
  scoreText: { color: '#4CAF50', fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  scoreTop: { color: '#4CAF50', fontSize: 24, textAlign: 'center', marginTop: 50, fontWeight: 'bold' },
  grid: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  btn: { width: 95, height: 95, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
  target: { position: 'absolute', width: 100, height: 100, backgroundColor: '#FF0055', borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
  targetText: { color: '#fff', fontWeight: 'bold' },
  menuBtn: { backgroundColor: '#333', padding: 25, borderRadius: 15, width: '100%', elevation: 5 },
  menuText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 18 },
  startBtn: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 12, width: 200, elevation: 5 },
  back: { color: '#666', marginTop: 40, textDecorationLine: 'underline', fontWeight: 'bold' },
  exitBtn: { position: 'absolute', bottom: 40, width: '100%' },
  exitText: { color: '#FF0055', textAlign: 'center', textDecorationLine: 'underline', fontSize: 18, fontWeight: 'bold' }
});
