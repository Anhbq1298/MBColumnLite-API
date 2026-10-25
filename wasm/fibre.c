// EC2 rectangular fibre integration prototype. Not a complete PMM solver.
#include <stddef.h>
__attribute__((import_module("env"),import_name("pow"))) extern double js_pow(double,double);
static double *bars=0;
static int nbar=0;
static double output[3];
static double clamp(double x,double a,double b){return x<a?a:(x>b?b:x);}
static double cstress(double e,double peak,double n,double cap,int bilinear){
 if(e<=0)return 0; if(e>=peak)return cap;
 double r=e/peak;
 return bilinear?cap*r:cap*(1-js_pow(1-r,n));
}
__attribute__((export_name("set_bars"))) void set_bars(unsigned long ptr,int n){bars=(double*)(size_t)ptr;nbar=n;}
__attribute__((export_name("result_ptr"))) unsigned long result_ptr(void){return (unsigned long)output;}
__attribute__((export_name("integrate_rect"))) void integrate_rect(
 double b,double h,int nx,int ny,double ax,double ay,double maxproj,double depth,double enear,double efar,
 double fc,double alpha,double eta,double gc,double peak,double expn,int bilinear,
 double fy,double gs,double es){
 if(nx<1||ny<1||nx>500||ny>500||b<=0||h<=0||depth<=0||gc<=0||gs<=0||nbar<0||nbar>2000){output[0]=output[1]=output[2]=0;return;}
 double dx=b/nx,dy=h/ny,cap=alpha*eta*fc/gc,N=0,Mx=0,My=0;
 for(int i=0;i<nx;i++){double x=-b/2+dx*(i+.5);for(int j=0;j<ny;j++){
  double y=-h/2+dy*(j+.5),e=enear+(maxproj-(x*ax+y*ay))/depth*(efar-enear);
  double F=cstress(e,peak,expn,cap,bilinear)*dx*dy;N+=F;Mx-=F*y;My+=F*x;
 }}
 double fyd=fy/gs;
 for(int k=0;k<nbar;k++){
  double x=bars[4*k],y=bars[4*k+1],area=bars[4*k+2];
  double e=enear+(maxproj-(x*ax+y*ay))/depth*(efar-enear);
  double F=(clamp(es*e,-fyd,fyd)-cstress(e,peak,expn,cap,bilinear))*area;
  N+=F;Mx-=F*y;My+=F*x;
 }
 output[0]=N;output[1]=Mx;output[2]=My;
}
