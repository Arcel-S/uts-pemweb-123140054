import React from 'react';
// Impor ikon yang dibutuhkan
import { 
    HiOutlineGlobeAlt, 
    HiOutlineDocumentText, 
    HiOutlineLockClosed, 
    HiOutlineMail, 
    HiOutlinePhone, 
    HiOutlineVideoCamera, 
    HiOutlineChatAlt2 
} from 'react-icons/hi';
import '../components/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="main-footer">
            <div className="footer-content">
                
                {/* === KOLOM 1: IDENTITAS & NEWS API === */}
                <div className="footer-section">
                    <span className="footer-logo">NEWSPORTAL.ID</span>
                    
                    <p className="footer-tagline">
                        Kabar Seluruh Dunia, Cepat, Akurat, dan Terpercaya.
                    </p>
                    
                    <ul className="footer-links">
                        <li><a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer"><HiOutlineGlobeAlt /> Data & API: NewsAPI</a></li>
                        <li><a href="#"><HiOutlineDocumentText /> Terms of Use</a></li>
                        <li><a href="#"><HiOutlineLockClosed /> Privacy Policy</a></li>
                    </ul>
                </div>

                {/* === KOLOM 2: TENTANG KAMI === */}
                <div className="footer-section">
                    <h4>Tentang Kami</h4>
                    <p className="footer-description">
                        <b>NEWSPORTAL.ID</b> adalah agregator berita independen yang didedikasikan 
                        untuk menyajikan headline terbaru dari berbagai sumber global.
                    </p>
                    <p className="footer-copyright">
                        &copy; {currentYear} NEWSPORTAL.ID by Marcel Kevin Togap Siagian - 123140054 
                        <br />
                        All rights reserved.
                    </p>
                </div>

                {/* === KOLOM 3: KONTAK & SOSIAL MEDIA DUMMY === */}
                <div className="footer-section">
                    <h4>Hubungi Kami (Dummy Data)</h4>
                    <ul className="footer-links">
                        <li><a href="mailto:contact@newsportal.id"><HiOutlineMail /> Email: contact@newsportal.id</a></li>
                        <li><a href="#"><HiOutlinePhone /> Phone: +62 812-3456-7890</a></li>
                        <li><a href="#"><HiOutlineVideoCamera /> YouTube: NewsPortalID</a></li>
                        <li><a href="#"><HiOutlineChatAlt2 /> Twitter: @NewsPortalID</a></li>
                    </ul>
                </div>
                
            </div>
        </footer>
    );
};

export default Footer;