a=0
b="152"
g="GB"
u="UTF" 
cd $b
for i in *.txt
 do
 echo $i ;
 a=$(($a + 1));
 echo "第$a 本书:" >> ../$b.txt;
 #echo $i >> 1.txt ;
 echo ${i%*${i:(-4)}} >> ../$b.txt ;
 #cat  "$i" | iconv -f GBK -t UTF-8 >> ../$b.txt
 f=`enca -L zh_CN "$i" | cut -d ';' -f 2 `
 echo $f+1 ;
 if [[ $f == *$g* ]]; then h="GB18030" ;elif [[ $f == *$u* ]]; then h="UTF-8" ;else h="UTF-16";fi
 #if [[ $f = "GB*" ]]; then h="GBK" ;elif [[ $f = "UTF*" ]]; then h="UTF-8" ;else h="UTF-16" ;fi
 echo $h ;
 cat  "$i" | iconv -f $h -t UTF-8 >> ../$b.txt
 #enca -L zh_CN "$i" | cut -d ';' -f 2 |xargs -i cat  "$i" | iconv -f {} -t UTF-8 
 echo  " " >> ../$b.txt
done