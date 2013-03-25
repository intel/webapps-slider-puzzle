# build widget and deploy to handset;
# if the handset doesn't have the tizen-app-reinstall.sh
# script, this script will first copy it to /opt/home/tizen/;
reset

# get the app URL from config.xml
APP_ID=`grep xmlns:tizen config.xml | tr ' ' '\n' | awk -F= '/id=/ {print $2}' | tr -d '"'`
FILE_PREFIX=`basename $APP_ID`

echo "APP_ID = $APP_ID; FILE_PREFIX = $FILE_PREFIX"

WIDGET_PACKAGE=$FILE_PREFIX.wgt
WIDGET_TMP_DIR=/tmp/$FILE_PREFIX-output

SCRIPT=./tools/tizen-app-reinstall.sh
WGT_PACKAGE_SCRIPT=./tools/make-wgt.sh
REMOTE_DIR=/opt/home/developer
SCRIPT_FILE=`basename $SCRIPT`
REMOTE_SCRIPT=$REMOTE_DIR/$SCRIPT_FILE

HAS_SCRIPT=`sdb shell "ls $REMOTE_DIR | grep $SCRIPT_FILE"`

if [ "x$HAS_SCRIPT" = "x" ] ; then
  sdb push $SCRIPT $REMOTE_DIR/
  sdb shell "chmod +x $REMOTE_SCRIPT"
fi

$WGT_PACKAGE_SCRIPT $WIDGET_PACKAGE

sdb push ./$WIDGET_PACKAGE $REMOTE_DIR

sdb shell "$REMOTE_SCRIPT $APP_ID $REMOTE_DIR/$WIDGET_PACKAGE" | tee $WIDGET_TMP_DIR

PORT=`cat $WIDGET_TMP_DIR | grep PORT | awk '{print $2}'`

rm $WIDGET_TMP_DIR

if [ "x$PORT" != "x" ] ; then
  echo "forwarding to tcp port $PORT"

  sdb forward tcp:8888 tcp:$PORT

  echo "****************************************************"
  echo "debug at http://localhost:8888/inspector.html?page=1"
fi
