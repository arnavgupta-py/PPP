import numpy as np
from scipy.io.wavfile import write
import os

fs = 44100
duration = 1.0

notes_freq = {
    'Sa': 240,
    'Re': 270,
    'Ga': 300,
    'Ma': 320,
    'Pa': 360,
    'Dha': 400,
    'Ni': 450,
    'Sa_hi': 480
}

output_folder = "notes"
os.makedirs(output_folder, exist_ok=True)

def generate_rich_note(frequency, duration, fs):
    t = np.linspace(0, duration, int(fs * duration), endpoint=False)
    
    harmonics = {
        1: 1.0, 
        2: 0.5, 
        3: 0.3, 
        4: 0.15 
    }
    
    wave = np.zeros_like(t)
    for h, amp in harmonics.items():
        wave += amp * np.sin(2 * np.pi * (frequency * h) * t)
    
    attack_time = 0.05
    release_time = 0.20
    
    attack_samples = int(fs * attack_time)
    release_samples = int(fs * release_time)
    sustain_samples = len(t) - attack_samples - release_samples
    
    attack_envelope = np.linspace(0, 1, attack_samples)
    release_envelope = np.linspace(1, 0, release_samples)
    sustain_envelope = np.ones(sustain_samples)
    
    envelope = np.concatenate([attack_envelope, sustain_envelope, release_envelope])
    
    wave *= envelope
    
    wave /= np.max(np.abs(wave))
    
    return wave

for note, freq in notes_freq.items():
    print(f"Generating {note}.wav ({freq} Hz)")
    wave = generate_rich_note(freq, duration, fs)
    wave_int16 = np.int16(wave * 32767)
    write(os.path.join(output_folder, f"{note}.wav"), fs, wave_int16)

print("All notes generated successfully in the 'notes' folder.")