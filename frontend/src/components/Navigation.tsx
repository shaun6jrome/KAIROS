import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ShieldAlert, Settings, LayoutDashboard } from 'lucide-react';
import styles from './Navigation.module.css';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Analysis', href: '/analysis', icon: Activity },
  { name: 'Probes & Root Cause', href: '/probes', icon: ShieldAlert },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>K</div>
          <span className={styles.logoText}>KAIROS</span>
        </div>
        
        <div className={styles.navLinks}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
                <Icon size={18} />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator" 
                    className={styles.activeIndicator}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
        
        <div className={styles.userSection}>
          <div className={styles.avatar}></div>
        </div>
      </div>
    </nav>
  );
}
