import React, {useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import "./Navigation.css";
import  supabase  from "../../../../back/supabase";

const user = supabase.auth.getUser();
const Navigation = () => {
    const location = useLocation();

    // State pour stocker l'utilisateur s'il est connecté
    const [user, setUser] = useState(null);
    // Récupère l'utilisateur au montage du composant
    useEffect(() => {
        const fetchUser = async () => {
            const {data, error} = await supabase.auth.getUser();
            if (!error && data?.user) {
                setUser(data.user); // On met à jour le state si un utilisateur est connecté
            }
        };

        fetchUser();

        // Abonnement pour écouter les changements d'auth (login/logout)
        const {data: subscription} = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        // Nettoyage à l'unmount
        return () => {
            subscription?.subscription.unsubscribe();
        };
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navigation">
            <div className="nav-container">
                <Link to={ROUTES.HOME} className="nav-logo">
                    <div className="logo-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 200 200"
              width="25"
              height="25"
              className="logo-svg"
            >
              <g clipPath="url(#cs_clip_1_flower-3)">
                <mask
                  id="cs_mask_1_flower-3"
                  style={{maskType: "alpha"}}
                  width="200"
                  height="200"
                  x="0"
                  y="0"
                  maskUnits="userSpaceOnUse"
                >
                  <path
                    fill="#fff"
                    d="M200 50c0-27.614-22.386-50-50-50s-50 22.386-50 50c0-27.614-22.386-50-50-50S0 22.386 0 50s22.386 50 50 50c-27.614 0-50 22.386-50 50s22.386 50 50 50 50-22.386 50-50c0 27.614 22.386 50 50 50s50-22.386 50-50c0-27.608-22.375-49.989-49.98-50C177.625 99.99 200 77.608 200 50z"
                  ></path>
                </mask>
                <g mask="url(#cs_mask_1_flower-3)">
                  <path fill="#fff" d="M200 0H0v200h200V0z"></path>
                  <path
                    fill="url(#paint0_linear_748_4691)"
                    fillOpacity="0.55"
                    d="M200 0H0v200h200V0z"
                  ></path>
                  <g filter="url(#filter0_f_748_4691)">
                    <path fill="#18A0FB" d="M131 3H-12v108h143V3z"></path>
                    <path fill="#FF58E4" d="M190 109H0v116h190V109z"></path>
                    <ellipse
                      cx="153.682"
                      cy="64.587"
                      fill="#FFD749"
                      rx="83"
                      ry="57"
                      transform="rotate(-33.875 153.682 64.587)"
                    ></ellipse>
                  </g>
                </g>
              </g>
              <defs>
                <filter
                  id="filter0_f_748_4691"
                  width="361.583"
                  height="346.593"
                  x="-72"
                  y="-61.593"
                  colorInterpolationFilters="sRGB"
                  filterUnits="userSpaceOnUse"
                >
                  <feFlood
                    floodOpacity="0"
                    result="BackgroundImageFix"
                  ></feFlood>
                  <feBlend
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  ></feBlend>
                  <feGaussianBlur
                    result="effect1_foregroundBlur_748_4691"
                    stdDeviation="30"
                  ></feGaussianBlur>
                </filter>
                <linearGradient
                  id="paint0_linear_748_4691"
                  x1="200"
                  x2="0"
                  y1="0"
                  y2="200"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF1F00"></stop>
                  <stop offset="1" stopColor="#FFD600"></stop>
                </linearGradient>
                <clipPath id="cs_clip_1_flower-3">
                  <path fill="#fff" d="M0 0H200V200H0z"></path>
                </clipPath>
              </defs>
              <g style={{mixBlendMode: "overlay"}} mask="url(#cs_mask_1_flower-3)">
                <path
                  fill="gray"
                  stroke="transparent"
                  d="M200 0H0v200h200V0z"
                  filter="url(#cs_noise_1_flower-3)"
                ></path>
              </g>
              <defs>
                <filter
                  id="cs_noise_1_flower-3"
                  width="100%"
                  height="100%"
                  x="0%"
                  y="0%"
                  filterUnits="objectBoundingBox"
                >
                  <feTurbulence
                    baseFrequency="0.6"
                    numOctaves="5"
                    result="out1"
                    seed="4"
                  ></feTurbulence>
                  <feComposite
                    in="out1"
                    in2="SourceGraphic"
                    operator="in"
                    result="out2"
                  ></feComposite>
                  <feBlend
                    in="SourceGraphic"
                    in2="out2"
                    mode="overlay"
                    result="out3"
                  ></feBlend>
                </filter>
              </defs>
            </svg>
            <span className="logo-text">0Viewers</span>
                    </div>

                </Link>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link
                            to={ROUTES.HOME}
                            className={`nav-link ${isActive(ROUTES.HOME) ? "active" : ""}`}
                        >
                            🏠 Accueil
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to={ROUTES.STREAMERS}
                            className={`nav-link ${
                isActive(ROUTES.STREAMERS) ? "active" : ""
              }`}
                        >
                            🎮 Streamers
                        </Link>
                    </li>
                    <li className="nav-item">
                        {user ? (
                            <Link
                                to={ROUTES.ACCOUNT}
                                className={`nav-link ${isActive(ROUTES.ACCOUNT) ? "active" : ""}`}
                            >
                                👤 Mon Compte
                            </Link>
                        ) : (
                            <Link
                                to={ROUTES.SIGNIN}
                                className={`nav-link ${isActive(ROUTES.SIGNIN) ? 'active' : ''}`}
                            >
                                👤 Me connecter
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;