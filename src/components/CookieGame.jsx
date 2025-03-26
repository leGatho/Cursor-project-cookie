import React, { useState, useEffect } from 'react';
import './CookieGame.css';

const CookieGame = () => {
  const [cookies, setCookies] = useState(0);
  const [farms, setFarms] = useState([]);
  const [farmPrices, setFarmPrices] = useState({
    basic: 10,
    advanced: 50,
    super: 200,
    mega: 1000,
    ultra: 5000,
    quantum: 25000,
    cosmic: 100000,
    galactic: 500000,
    infinite: 2500000,
    legendary: 10000000,
    mythical: 50000000,
    divine: 250000000,
    ultimate: 1000000000
  });
  const [cookieJar, setCookieJar] = useState(0);
  const [isBonusActive, setIsBonusActive] = useState(false);
  const [jarLevel, setJarLevel] = useState(1); // Nouveau niveau du pot
  const [goldenCookies, setGoldenCookies] = useState([]);
  const [clickPopups, setClickPopups] = useState([]);
  const BONUS_DURATION = 10000; // 10 secondes
  const JAR_FILL_INTERVAL = 100; // Remplissage toutes les 100ms

  // Fonction pour calculer la capacité maximale du pot en fonction du niveau
  const calculateMaxCookieJar = (level) => {
    // Progression exponentielle fixe : 1k, 5k, 20k, 100k, 500k, etc.
    return Math.floor(1000 * Math.pow(5, level - 1));
  };

  const handleCookieClick = (event) => {
    setCookies(prev => prev + 1);
    
    // Créer un nouveau popup
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newPopup = {
      id: Date.now(),
      x,
      y
    };
    
    setClickPopups(prev => [...prev, newPopup]);
    
    // Supprimer le popup après l'animation
    setTimeout(() => {
      setClickPopups(prev => prev.filter(popup => popup.id !== newPopup.id));
    }, 1000);

    if (!isBonusActive) {
      const maxJar = calculateMaxCookieJar(jarLevel);
      setCookieJar(prev => Math.min(prev + 1, maxJar));
    }
  };

  const buyFarm = (type) => {
    const price = farmPrices[type];
    if (cookies >= price) {
      setCookies(prev => prev - price);
      setFarms(prev => [...prev, { type, production: getFarmProduction(type) }]);
      setFarmPrices(prev => ({
        ...prev,
        [type]: Math.floor(prev[type] * 1.5)
      }));
    }
  };

  const getFarmProduction = (type) => {
    switch (type) {
      case 'basic':
        return 1;
      case 'advanced':
        return 5;
      case 'super':
        return 20;
      case 'mega':
        return 100;
      case 'ultra':
        return 500;
      case 'quantum':
        return 2500;
      case 'cosmic':
        return 10000;
      case 'galactic':
        return 50000;
      case 'infinite':
        return 250000;
      case 'legendary':
        return 1000000;
      case 'mythical':
        return 5000000;
      case 'divine':
        return 25000000;
      case 'ultimate':
        return 100000000;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const totalProduction = farms.reduce((acc, farm) => acc + farm.production, 0);
      const productionWithBonus = isBonusActive ? totalProduction * 2 : totalProduction;
      setCookies(prev => prev + productionWithBonus);
    }, 1000);

    return () => clearInterval(interval);
  }, [farms, isBonusActive]);

  useEffect(() => {
    if (isBonusActive) return;

    const totalProduction = farms.reduce((acc, farm) => acc + farm.production, 0);
    if (totalProduction === 0) return;

    const maxJar = calculateMaxCookieJar(jarLevel);
    // Le remplissage est maintenant proportionnel à la production totale
    const fillAmount = Math.min(
      totalProduction / 100,
      maxJar - cookieJar
    );
    
    const fillInterval = setInterval(() => {
      setCookieJar(prev => {
        const newValue = Math.min(prev + fillAmount, maxJar);
        if (newValue >= maxJar) {
          activateBonus();
        }
        return newValue;
      });
    }, JAR_FILL_INTERVAL);

    return () => clearInterval(fillInterval);
  }, [farms, cookieJar, isBonusActive, jarLevel]);

  const activateBonus = () => {
    setIsBonusActive(true);
    setCookieJar(0);
    setJarLevel(prev => prev + 1); // Augmente le niveau du pot
    setTimeout(() => {
      setIsBonusActive(false);
    }, BONUS_DURATION);
  };

  const getFarmCount = (type) => {
    return farms.filter(farm => farm.type === type).length;
  };

  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getFarmEmoji = (type) => {
    switch (type) {
      case 'basic':
        return '🏠';
      case 'advanced':
        return '🏭';
      case 'super':
        return '🏢';
      case 'mega':
        return '🏰';
      case 'ultra':
        return '🌆';
      case 'quantum':
        return '⚛️';
      case 'cosmic':
        return '🌌';
      case 'galactic':
        return '🌠';
      case 'infinite':
        return '♾️';
      case 'legendary':
        return '👑';
      case 'mythical':
        return '🐉';
      case 'divine':
        return '✨';
      case 'ultimate':
        return '🌟';
      default:
        return '🏠';
    }
  };

  const totalProduction = farms.reduce((acc, farm) => acc + farm.production, 0);
  const maxCookieJar = calculateMaxCookieJar(jarLevel);

  // Fonction pour créer un nouveau cookie doré
  const createGoldenCookie = () => {
    const id = Date.now() + Math.random();
    const left = Math.random() * 100;
    const duration = 3 + Math.random() * 2; // Durée entre 3 et 5 secondes
    return { id, left, duration };
  };

  // Effet pour générer des cookies dorés pendant le bonus
  useEffect(() => {
    if (!isBonusActive) return;

    // Créer un premier lot de cookies
    const initialCookies = Array.from({ length: 10 }, createGoldenCookie);
    setGoldenCookies(initialCookies);

    const interval = setInterval(() => {
      setGoldenCookies(prev => {
        // Supprime les cookies qui ont fini leur animation
        const activeCookies = prev.filter(cookie => 
          Date.now() - cookie.id < cookie.duration * 1000
        );
        // Ajoute un nouveau cookie toutes les 300ms
        return [...activeCookies, createGoldenCookie()];
      });
    }, 300);

    return () => {
      clearInterval(interval);
      setGoldenCookies([]);
    };
  }, [isBonusActive]);

  return (
    <>
      <div className="cookie-pattern"></div>
      <div className={`cookie-game ${isBonusActive ? 'bonus-active' : ''}`}>
        <div className="decorative-elements">
          <span className="cookie-decoration">🍪</span>
          <span className="cookie-decoration">🍪</span>
          <span className="cookie-decoration">🍪</span>
        </div>
        {isBonusActive && (
          <div className="golden-cookies">
            {goldenCookies.map(cookie => (
              <div
                key={cookie.id}
                className="golden-cookie"
                style={{
                  left: `${cookie.left}%`,
                  animationDuration: `${cookie.duration}s`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              >
                🍪
              </div>
            ))}
          </div>
        )}
        <div className="game-content">
          <div className="main-content">
            <h1>🍪 La Maison des Cookies 🍪</h1>
            {isBonusActive && (
              <div className="bonus-indicator">
                <span className="bonus-text">✨ BONUS x2 ACTIF ✨</span>
                <div className="bonus-timer"></div>
              </div>
            )}
            <div className="cookie-container">
              <div className="cookie" onClick={handleCookieClick}>
                🍪
                {clickPopups.map(popup => (
                  <div
                    key={popup.id}
                    className="click-popup"
                    style={{
                      left: `${popup.x}px`,
                      top: `${popup.y}px`
                    }}
                  >
                    +1
                  </div>
                ))}
              </div>
            </div>
            <div className="stats">
              <p>🍪 Cookies: {formatNumber(Math.floor(cookies))}</p>
              <p>⚡ Production totale: {formatNumber(totalProduction * (isBonusActive ? 2 : 1))} cookies/seconde</p>
            </div>
          </div>
        </div>
        <div className="shop">
          <h2>🏪 La Boutique des Fermes</h2>
          {Object.entries(farmPrices).map(([type, price]) => (
            <button 
              key={type}
              onClick={() => buyFarm(type)}
              disabled={cookies < price}
            >
              {getFarmEmoji(type)} Acheter {type.charAt(0).toUpperCase() + type.slice(1)} Ferme ({formatNumber(price)} cookies)
              <span className="farm-info">
                {getFarmCount(type)} possédées • {formatNumber(getFarmProduction(type))} cookies/sec
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="cookie-jar">
        <div className="jar-container">
          <div className="jar-fill" style={{ height: `${(cookieJar / maxCookieJar) * 100}%` }}></div>
        </div>
        <div className="jar-label">
          Pot à Cookies
          <div className="jar-level">Niveau {jarLevel}</div>
          <div className="jar-progress">
            {formatNumber(Math.floor(cookieJar))} / {formatNumber(maxCookieJar)}
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieGame; 