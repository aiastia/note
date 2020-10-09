#!/usr/bin/env bash
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

# Current folder
cur_dir=`pwd`
# Color
red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
plain='\033[0m'
software=(使用自签证书的WSS模式 使用CF证书的WSS模式 TCP模式且同时支持WS模式)
operation=(全新安装 更新配置 更新镜像 查看日志)
# Make sure only root can run our script
[[ $EUID -ne 0 ]] && echo -e "[${red}Error${plain}] 你没权没势 请先获取ROOT权限!" && exit 1

#Check system
check_sys(){
    local checkType=$1
    local value=$2

    local release=''
    local systemPackage=''

    if [[ -f /etc/redhat-release ]]; then
        release="centos"
        systemPackage="yum"
    elif grep -Eqi "debian|raspbian" /etc/issue; then
        release="debian"
        systemPackage="apt"
    elif grep -Eqi "ubuntu" /etc/issue; then
        release="ubuntu"
        systemPackage="apt"
    elif grep -Eqi "centos|red hat|redhat" /etc/issue; then
        release="centos"
        systemPackage="yum"
    elif grep -Eqi "debian|raspbian" /proc/version; then
        release="debian"
        systemPackage="apt"
    elif grep -Eqi "ubuntu" /proc/version; then
        release="ubuntu"
        systemPackage="apt"
    elif grep -Eqi "centos|red hat|redhat" /proc/version; then
        release="centos"
        systemPackage="yum"
    fi

    if [[ "${checkType}" == "sysRelease" ]]; then
        if [ "${value}" == "${release}" ]; then
            return 0
        else
            return 1
        fi
    elif [[ "${checkType}" == "packageManager" ]]; then
        if [ "${value}" == "${systemPackage}" ]; then
            return 0
        else
            return 1
        fi
    fi
}

# Get version
getversion(){
    if [[ -s /etc/redhat-release ]]; then
        grep -oE  "[0-9.]+" /etc/redhat-release
    else
        grep -oE  "[0-9.]+" /etc/issue
    fi
}

# CentOS version
centosversion(){
    if check_sys sysRelease centos; then
        local code=$1
        local version="$(getversion)"
        local main_ver=${version%%.*}
        if [ "$main_ver" == "$code" ]; then
            return 0
        else
            return 1
        fi
    else
        return 1
    fi
}

get_char(){
    SAVEDSTTY=`stty -g`
    stty -echo
    stty cbreak
    dd if=/dev/tty bs=1 count=1 2> /dev/null
    stty -raw
    stty echo
    stty $SAVEDSTTY
}
error_detect_depends(){
    local command=$1
    local depend=`echo "${command}" | awk '{print $4}'`
    echo -e "[${green}Info${plain}] 开始安装软件包 ${depend}"
    ${command} > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo -e "[${red}Error${plain}] 软件包安装失败 ${red}${depend}${plain}"
        echo "请查看帮助网站: https://teddysun.com/486.html and contact."
        exit 1
    fi
}

# Pre-installation settings
pre_install_docker_compose(){
    # Set ssrpanel_url
    echo "请输入你SSP前端的网址"
    read -p "(http://xxx.com 有tls的换成https 注意网址最后不要有斜杠‘/’):" ssrpanel_url
    [ -z "${ssrpanel_url}" ]
    echo
    echo "---------------------------"
    echo "SSPanel网址 = ${ssrpanel_url}"
    echo "---------------------------"
    echo
    # Set ssrpanel key
    echo "你前端config文件里的Mukey值"
    read -p "(你网站目录/www/wwwroot/xxx/config.php 里面的mukey值 前后端要对应):" ssrpanel_key
    [ -z "${ssrpanel_key}" ]
    echo
    echo "---------------------------"
    echo "SSPanel通信密钥 = ${ssrpanel_key}"
    echo "---------------------------"
    echo

    # Set ssrpanel speedtest function
    echo "你打算隔多久进行一次节点网速测试"
    read -p "(多久一次: 回车默认6小时进行一次):" ssrpanel_speedtest
    [ -z "${ssrpanel_speedtest}" ] && ssrpanel_speedtest=6
    echo
    echo "---------------------------"
    echo "几小时一次 = ${ssrpanel_speedtest}"
    echo "---------------------------"
    echo

    # Set ssrpanel node_id
    echo "你前端节点信息里面的节点ID"
    read -p "(就你他妈前端添加节点后生成的ID 比如说是3这样子):" ssrpanel_node_id
    [ -z "${ssrpanel_node_id}" ] && ssrpanel_node_id=0
    echo
    echo "---------------------------"
    echo "SSPanel前端节点ID = ${ssrpanel_node_id}"
    echo "---------------------------"
    echo

    # Set V2ray backend API Listen port
    echo "请设置V2RAY的出口监听端口"
    read -p "(回车默认2333端口即可 如有多开合租请不要重复):" v2ray_api_port
    [ -z "${v2ray_api_port}" ] && v2ray_api_port=2333
    echo
    echo "---------------------------"
    echo "V2RAY出口监听端口 = ${v2ray_api_port}"
    echo "---------------------------"
    echo

    # Set Setting if the node go downwith panel
    echo "请问你前端面板是什么程序"
    read -p "(回车默认SSPANEL面板：1):" v2ray_downWithPanel
    [ -z "${v2ray_downWithPanel}" ] && v2ray_downWithPanel=1
    echo
    echo "---------------------------"
    echo "前端面板类型 = ${v2ray_downWithPanel}"
    echo "---------------------------"
    echo
}

pre_install_caddy(){

    # Set caddy v2ray domain
    echo "请输入你解析到本节点服务器的域名"
    read -p "WS模式要求提供解析到本节点IP的网址:" v2ray_domain
    [ -z "${v2ray_domain}" ]
    echo
    echo "---------------------------"
    echo "伪装域名 = ${v2ray_domain}"
    echo "---------------------------"
    echo


    # Set caddy v2ray path
    echo "CADDY反代到V2RAY的虚拟目录"
    read -p "(务必于前端节点信息的Path值相同,回车默认: /v2ray):" v2ray_path
    [ -z "${v2ray_path}" ] && v2ray_path="/v2ray"
    echo
    echo "---------------------------"
    echo "伪装目录 = ${v2ray_path}"
    echo "---------------------------"
    echo

    # Set caddy v2ray tls email
    echo "前端获取TLS证书时登记的邮箱"
    read -p "直接回车默认即可(admin@admin.com):" v2ray_email
    [ -z "${v2ray_email}" ] && v2ray_email="admin@admin.com"
    echo
    echo "---------------------------"
    echo "证书邮箱 = ${v2ray_email}"
    echo "---------------------------"
    echo

    # Set Caddy v2ray listen port
    echo "V2RAY后端入口监听端口"
    read -p "(如多开合租注意请不要重复,回车默认端口: 10550):" v2ray_local_port
    [ -z "${v2ray_local_port}" ] && v2ray_local_port=10550
    echo
    echo "---------------------------"
    echo "V2RAY后端入口监听端口 = ${v2ray_local_port}"
    echo "---------------------------"
    echo

    # Set Caddy  listen port
    echo "CADDY前端入口监听端口"
    read -p "(如多开合租注意请不要重复,回车默认端口: 443):" caddy_listen_port
    [ -z "${caddy_listen_port}" ] && caddy_listen_port=443
    echo
    echo "---------------------------"
    echo "CADDY前端入口监听端口 = ${caddy_listen_port}"
    echo "---------------------------"
    echo


}

# Config docker
config_docker(){
    echo "按任意键进行下一步...或者按 Ctrl+C 取消安装"
    char=`get_char`
    cd ${cur_dir}
    echo "开始安装软件包"
    install_dependencies
    echo "等待加载DOCKER配置文件"
    curl -L https://raw.githubusercontent.com/hulisang/v2ray-sspanel-v3-mod_Uim-plugin/master/Docker/V2ray/docker-compose.yml > docker-compose.yml
    sed -i "s|node_id:.*|node_id: ${ssrpanel_node_id}|"  ./docker-compose.yml
    sed -i "s|sspanel_url:.*|sspanel_url: '${ssrpanel_url}'|"  ./docker-compose.yml
    sed -i "s|key:.*|key: '${ssrpanel_key}'|"  ./docker-compose.yml
    sed -i "s|speedtest:.*|speedtest: ${ssrpanel_speedtest}|"  ./docker-compose.yml
    sed -i "s|api_port:.*|api_port: ${v2ray_api_port}|" ./docker-compose.yml
    sed -i "s|downWithPanel:.*|downWithPanel: ${v2ray_downWithPanel}|" ./docker-compose.yml
}


# Config caddy_docker
config_caddy_docker(){
    echo "按任意键进行下一步...或者按 Ctrl+C 取消安装"
    char=`get_char`
    cd ${cur_dir}
    echo "开始安装软件包"
    install_dependencies
    curl -L https://raw.githubusercontent.com/hulisang/v2ray-sspanel-v3-mod_Uim-plugin/master/Docker/Caddy_V2ray/Caddyfile >  Caddyfile
    echo "等待加载DOCKER配置文件"
    curl -L https://raw.githubusercontent.com/hulisang/v2ray-sspanel-v3-mod_Uim-plugin/master/Docker/Caddy_V2ray/docker-compose.yml > docker-compose.yml
    sed -i "s|node_id:.*|node_id: ${ssrpanel_node_id}|"  ./docker-compose.yml
    sed -i "s|sspanel_url:.*|sspanel_url: '${ssrpanel_url}'|"  ./docker-compose.yml
    sed -i "s|key:.*|key: '${ssrpanel_key}'|"  ./docker-compose.yml
    sed -i "s|speedtest:.*|speedtest: ${ssrpanel_speedtest}|"  ./docker-compose.yml
    sed -i "s|api_port:.*|api_port: ${v2ray_api_port}|" ./docker-compose.yml
    sed -i "s|downWithPanel:.*|downWithPanel: ${v2ray_downWithPanel}|" ./docker-compose.yml
    sed -i "s|V2RAY_DOMAIN=xxxx.com|V2RAY_DOMAIN=${v2ray_domain}|"  ./docker-compose.yml
    sed -i "s|V2RAY_PATH=/v2ray|V2RAY_PATH=${v2ray_path}|"  ./docker-compose.yml
    sed -i "s|V2RAY_EMAIL=xxxx@outlook.com|V2RAY_EMAIL=${v2ray_email}|"  ./docker-compose.yml
    sed -i "s|V2RAY_PORT=10550|V2RAY_PORT=${v2ray_local_port}|"  ./docker-compose.yml
    sed -i "s|V2RAY_OUTSIDE_PORT=443|V2RAY_OUTSIDE_PORT=${caddy_listen_port}|"  ./docker-compose.yml
}

# Config caddy_docker
config_caddy_docker_cloudflare(){

    # Set caddy cloudflare ddns email
    echo "你CF的邮箱账号"
    read -p "(No default ):" cloudflare_email
    [ -z "${cloudflare_email}" ]
    echo
    echo "---------------------------"
    echo "你CF的邮箱账号 = ${cloudflare_email}"
    echo "---------------------------"
    echo

    # Set caddy cloudflare ddns key
    echo "你CF的KEY密钥"
    read -p "(No default ):" cloudflare_key
    [ -z "${cloudflare_email}" ]
    echo
    echo "---------------------------"
    echo "你CF的KEY密钥 = ${cloudflare_key}"
    echo "---------------------------"
    echo
    echo

    echo "按任意键进行下一步...或者按 Ctrl+C 取消安装"
    char=`get_char`
    cd ${cur_dir}
    echo "我先安装curl "
    install_dependencies
    echo "开始加载CADDY和DOCKER的配置文件"
    curl -L https://raw.githubusercontent.com/hulisang/v2ray-sspanel-v3-mod_Uim-plugin/master/Docker/Caddy_V2ray/Caddyfile >Caddyfile
    epcho "加载DOCKER的配置文件中"
    curl -L https://raw.githubusercontent.com/hulisang/v2ray-sspanel-v3-mod_Uim-plugin/master/Docker/Caddy_V2ray/docker-compose.yml >docker-compose.yml
    sed -i "s|node_id:.*|node_id: ${ssrpanel_node_id}|"  ./docker-compose.yml
    sed -i "s|sspanel_url:.*|sspanel_url: '${ssrpanel_url}'|"  ./docker-compose.yml
    sed -i "s|key:.*|key: '${ssrpanel_key}'|"  ./docker-compose.yml
    sed -i "s|speedtest:.*|speedtest: ${ssrpanel_speedtest}|"  ./docker-compose.yml
    sed -i "s|api_port:.*|api_port: ${v2ray_api_port}|" ./docker-compose.yml
    sed -i "s|downWithPanel:.*|downWithPanel: ${v2ray_downWithPanel}|" ./docker-compose.yml
    sed -i "s|V2RAY_DOMAIN=xxxx.com|V2RAY_DOMAIN=${v2ray_domain}|"  ./docker-compose.yml
    sed -i "s|V2RAY_PATH=/v2ray|V2RAY_PATH=${v2ray_path}|"  ./docker-compose.yml
    sed -i "s|V2RAY_EMAIL=xxxx@outlook.com|V2RAY_EMAIL=${v2ray_email}|"  ./docker-compose.yml
    sed -i "s|V2RAY_PORT=10550|V2RAY_PORT=${v2ray_local_port}|"  ./docker-compose.yml
    sed -i "s|V2RAY_OUTSIDE_PORT=443|V2RAY_OUTSIDE_PORT=${caddy_listen_port}|"  ./docker-compose.yml
    sed -i "s|#      - CLOUDFLARE_EMAIL=xxxxxx@out.look.com|      - CLOUDFLARE_EMAIL=${cloudflare_email}|"  ./docker-compose.yml
    sed -i "s|#      - CLOUDFLARE_API_KEY=xxxxxxx|      - CLOUDFLARE_API_KEY=${cloudflare_key}|"  ./docker-compose.yml
    sed -i "s|# dns cloudflare|dns cloudflare|"  ./Caddyfile

}

# Install docker and docker compose
install_docker(){
    echo -e "开始安装 DOCKER "
    curl -fsSL https://get.docker.com -o get-docker.sh
    bash get-docker.sh
    echo -e "开始安装 Docker Compose "
    curl -L https://github.com/docker/compose/releases/download/1.17.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    curl -L https://raw.githubusercontent.com/docker/compose/1.8.0/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose
    clear
    echo "启动 Docker "
    service docker start
    echo "启动 Docker-Compose "
    docker-compose up -d
    echo
    echo -e "恭喜，V2ray服务器安装完成！"
    echo
    echo "注意:安装完成不代表安装成功 可能原因有："
    echo "1、你未购买本V2RAY后端脚本，未获得授权安装失败"
    echo "2、你的系统或者管理面板内置防火墙 请关闭或放行"
    echo "3、脚本配置信息输入有误 检查前端网址密钥节点ID"
    echo "4、玄学问题 你太帅导致的 指导联系TG@WocaonimaB"
    echo
}

install_check(){
    if check_sys packageManager yum || check_sys packageManager apt; then
        if centosversion 5; then
            return 1
        fi
        return 0
    else
        return 1
    fi
}

install_select(){
    clear
    while true
    do
    echo  "您选择哪个V2RAY后端安装方式:"
    for ((i=1;i<=${#software[@]};i++ )); do
        hint="${software[$i-1]}"
        echo -e "${green}${i}${plain}) ${hint}"
    done
    read -p "(推荐回车${software[0]}):" selected
    [ -z "${selected}" ] && selected="1"
    case "${selected}" in
        1|2|3|4)
        echo
        echo "你选择了 = ${software[${selected}-1]}"
        echo
        break
        ;;
        *)
        echo -e "[${red}Error${plain}] 别瞎几把乱输,请输入正确数字"
        ;;
    esac
    done
}
install_dependencies(){
    if check_sys packageManager yum; then
        echo -e "[${green}Info${plain}] 检查EPEL存储库..."
        if [ ! -f /etc/yum.repos.d/epel.repo ]; then
            yum install -y epel-release > /dev/null 2>&1
        fi
        [ ! -f /etc/yum.repos.d/epel.repo ] && echo -e "[${red}Error${plain}] 安装EPEL储存库失败，请检查一下." && exit 1
        [ ! "$(command -v yum-config-manager)" ] && yum install -y yum-utils > /dev/null 2>&1
        [ x"$(yum-config-manager epel | grep -w enabled | awk '{print $3}')" != x"True" ] && yum-config-manager --enable epel > /dev/null 2>&1
        echo -e "[${green}Info${plain}] 检查EPEL储存库是否完整..."

        yum_depends=(
             curl
        )
        for depend in ${yum_depends[@]}; do
            error_detect_depends "yum -y install ${depend}"
        done
    elif check_sys packageManager apt; then
        apt_depends=(
           curl
        )
        apt-get -y update
        for depend in ${apt_depends[@]}; do
            error_detect_depends "apt-get -y install ${depend}"
        done
    fi
    echo -e "[${green}Info${plain}] 将时区设置为上海"
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
    date -s "$(curl -sI g.cn | grep Date | cut -d' ' -f3-6)Z"

}
#update_image
更新镜像_v2ray(){
    echo "关闭当前服务"
    docker-compose down
    echo "加载DOCKER镜像"
    docker-compose pull
    echo "开始运行DOKCER服务"
    docker-compose up -d
}

#show last 100 line log

查看日志_v2ray(){
    echo "将要显示100行的运行日志"
    docker-compose logs --tail 100
}

# Update config
更新配置_v2ray(){
    cd ${cur_dir}
    echo "关闭当前服务"
    docker-compose down
    install_select
    case "${selected}" in
        1)
        pre_install_docker_compose
        pre_install_caddy
        config_caddy_docker
        ;;
        2)
        pre_install_docker_compose
        pre_install_caddy
        config_caddy_docker_cloudflare
        ;;
        3)
        pre_install_docker_compose
        config_docker
        ;;
        *)
        echo "错误的数字"
        ;;
    esac

    echo "开始运行DOKCER服务"
    docker-compose up -d

}
# remove config
# Install v2ray
全新安装_v2ray(){
    install_select
    case "${selected}" in
        1)
        pre_install_docker_compose
        pre_install_caddy
        config_caddy_docker
        ;;
        2)
        pre_install_docker_compose
        pre_install_caddy
        config_caddy_docker_cloudflare
        ;;
        3)
        pre_install_docker_compose
        config_docker
        ;;
        *)
        echo "错误的数字"
        ;;
    esac
    install_docker
}

# Initialization step
clear
while true
do
echo -e "\033[42;30m 此为由狐狸的脚本汉化版 不支持审计设备限速 \033[0m"
echo -e "\033[42;30m 如需代搭建或需技术指导请联系TG:@WocaonimaB \033[0m"
echo  ""
echo  "请输入数字选择你要进行的操作："
for ((i=1;i<=${#operation[@]};i++ )); do
    hint="${operation[$i-1]}"
    echo -e "${green}${i}${plain}) ${hint}"
done
read -p "请选择数字后回车 (回车默认 ${operation[0]}):" selected
[ -z "${selected}" ] && selected="1"
case "${selected}" in
    1|2|3|4)
    echo
    echo "你的想法 = ${operation[${selected}-1]}"
    echo
    ${operation[${selected}-1]}_v2ray
    break
    ;;
    *)
    echo -e "[${red}Error${plain}] 你妈逼啊,请输入正确数字 [1-4]"
    ;;
esac
done