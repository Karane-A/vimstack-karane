import { Popup, List, Avatar, Divider, Space } from 'antd-mobile';
import {
    SetOutline,
    UserOutline,
    LogoutOutline,
    GlobalOutline,
    BankcardOutline,
    FileOutline,
    StarOutline,
    GiftOutline,
    EnvironmentOutline,
    HistogramOutline,
} from 'antd-mobile-icons';
import { router, usePage } from '@inertiajs/react';

interface MobileDrawerProps {
    visible: boolean;
    onClose: () => void;
}

interface PageProps {
    auth?: {
        user?: {
            name: string;
            email: string;
            avatar?: string;
        };
    };
}

/**
 * Mobile drawer menu for secondary navigation
 * Includes user profile, settings, and additional menu items
 */
export function MobileDrawer({ visible, onClose }: MobileDrawerProps) {
    const { props } = usePage<PageProps>();
    const user = props.auth?.user;

    const handleNavigate = (path: string) => {
        router.visit(path);
        onClose();
    };

    const handleLogout = () => {
        router.post('/logout');
        onClose();
    };

    return (
        <Popup
            visible={visible}
            onMaskClick={onClose}
            position="left"
            bodyStyle={{
                width: '80vw',
                maxWidth: '320px',
                minHeight: '100vh',
            }}
        >
            <div className="mobile-drawer">
                {/* User Profile Header */}
                {user && (
                    <>
                        <div className="p-4">
                            <Space direction="vertical" style={{ '--gap': '8px' }}>
                                <Avatar
                                    src={user.avatar}
                                    style={{
                                        '--size': '64px',
                                        '--border-radius': '50%',
                                    }}
                                >
                                    {!user.avatar && user.name?.[0]?.toUpperCase()}
                                </Avatar>
                                <div>
                                    <div className="font-semibold text-base">
                                        {user.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {user.email}
                                    </div>
                                </div>
                            </Space>
                        </div>
                        <Divider style={{ margin: 0 }} />
                    </>
                )}

                {/* Main Navigation Items */}
                <List>
                    <List.Item
                        prefix={<UserOutline />}
                        onClick={() => handleNavigate('/profile')}
                        arrow
                    >
                        My Profile
                    </List.Item>
                    <List.Item
                        prefix={<HistogramOutline />}
                        onClick={() => handleNavigate('/analytics')}
                        arrow
                    >
                        Analytics
                    </List.Item>
                    <List.Item
                        prefix={<StarOutline />}
                        onClick={() => handleNavigate('/reviews')}
                        arrow
                    >
                        Reviews
                    </List.Item>
                    <List.Item
                        prefix={<GiftOutline />}
                        onClick={() => handleNavigate('/coupons')}
                        arrow
                    >
                        Coupons
                    </List.Item>
                    <List.Item
                        prefix={<EnvironmentOutline />}
                        onClick={() => handleNavigate('/shipping')}
                        arrow
                    >
                        Shipping
                    </List.Item>
                    <List.Item
                        prefix={<FileOutline />}
                        onClick={() => handleNavigate('/blog')}
                        arrow
                    >
                        Blog
                    </List.Item>
                </List>

                <Divider style={{ margin: '8px 0' }} />

                {/* Settings & System */}
                <List>
                    <List.Item
                        prefix={<BankcardOutline />}
                        onClick={() => handleNavigate('/billing')}
                        arrow
                    >
                        Billing & Plans
                    </List.Item>
                    <List.Item
                        prefix={<GlobalOutline />}
                        onClick={() => handleNavigate('/store-switcher')}
                        arrow
                    >
                        Switch Store
                    </List.Item>
                    <List.Item
                        prefix={<SetOutline />}
                        onClick={() => handleNavigate('/settings')}
                        arrow
                    >
                        Settings
                    </List.Item>
                </List>

                <Divider style={{ margin: '8px 0' }} />

                {/* Logout */}
                <List>
                    <List.Item
                        prefix={<LogoutOutline />}
                        onClick={handleLogout}
                        arrow={false}
                        style={{ color: 'var(--adm-color-danger)' }}
                    >
                        Logout
                    </List.Item>
                </List>
            </div>
        </Popup>
    );
}

export default MobileDrawer;
