# 📋 SLBFE HRM System - Pre-Deployment Checklist

Use this checklist before deploying to production on your Windows IIS servers.

---

## 🖥️ Server Requirements

### Hardware Requirements
- [ ] Windows Server 2019 or 2022 installed
- [ ] Minimum 8GB RAM (16GB recommended)
- [ ] Minimum 100GB disk space
- [ ] Dual-core CPU (Quad-core recommended)
- [ ] Network connectivity configured

### Software Requirements
- [ ] IIS 10.0 or later installed
- [ ] .NET 8.0 SDK installed
- [ ] .NET 8.0 Runtime installed
- [ ] ASP.NET Core 8.0 Hosting Bundle installed
- [ ] SQL Server 2019 or 2022 installed
- [ ] Node.js 18+ installed (for frontend build)
- [ ] Git installed (for version control)

### IIS Features Enabled
- [ ] Web Server (IIS) role
- [ ] ASP.NET Core Module V2
- [ ] URL Rewrite Module
- [ ] Windows Authentication (if needed)
- [ ] Static Content Compression
- [ ] Dynamic Content Compression

---

## 🗄️ Database Setup

### SQL Server Configuration
- [ ] SQL Server service running
- [ ] SQL Server Browser enabled (if using named instance)
- [ ] TCP/IP protocol enabled
- [ ] Port 1433 open in firewall (default)
- [ ] SQL Server authentication mode set to Mixed Mode

### Database Creation
- [ ] Database `SLBFE_HRM_DB` created
- [ ] Login `hrm_user` created with strong password
- [ ] User added to database with db_owner role
- [ ] Connection string tested and working
- [ ] Backup database `SLBFE_HRM_Hangfire` created
- [ ] Initial backup taken

### Database Security
- [ ] Strong password set for SQL login
- [ ] Unnecessary logins removed
- [ ] SQL Server Audit enabled
- [ ] Database encryption considered (TDE)
- [ ] Regular backup schedule configured

---

## 🔒 Security Configuration

### SSL/TLS Certificate
- [ ] SSL certificate obtained for domain
- [ ] Certificate installed in Windows certificate store
- [ ] Certificate private key is exportable
- [ ] Certificate chain complete
- [ ] Certificate expiration > 90 days
- [ ] Test certificate binding to IIS

### Application Security
- [ ] JWT SecretKey changed from default (min 256 bits)
- [ ] Strong password policy configured
- [ ] CORS origins restricted to production domain
- [ ] API rate limiting considered
- [ ] Request size limits configured
- [ ] File upload restrictions set

### Network Security
- [ ] Firewall rules configured
  - [ ] Port 80 (HTTP) open
  - [ ] Port 443 (HTTPS) open
  - [ ] Port 1433 (SQL Server) restricted to localhost
  - [ ] Port 5000/5001 restricted (if backend separate)
- [ ] DDoS protection considered
- [ ] IP whitelisting configured (if required)

---

## ⚙️ Backend Configuration

### Configuration Files
- [ ] `appsettings.Production.json` updated with:
  - [ ] Production database connection string
  - [ ] Secure JWT secret key
  - [ ] Production CORS origins
  - [ ] Email SMTP settings
  - [ ] File storage paths
  - [ ] Logging levels set appropriately
- [ ] `web.config` reviewed
- [ ] Environment variables set (if any)

### Application Settings
- [ ] Connection string format verified
- [ ] Database credentials secure
- [ ] Email credentials configured
- [ ] File storage directory created
- [ ] Log directory created with write permissions
- [ ] Data protection keys directory created

### Build Verification
- [ ] Backend builds successfully in Release mode
- [ ] No build warnings or errors
- [ ] All NuGet packages restored
- [ ] Project publishes successfully
- [ ] Publish output verified

---

## 🎨 Frontend Configuration

### Build Configuration
- [ ] `.env.production` file created
- [ ] API base URL updated to production
- [ ] Build runs successfully
- [ ] No console errors in production build
- [ ] Build output size reasonable (<5MB)
- [ ] Assets properly minified

### Testing
- [ ] Frontend loads without errors
- [ ] All routes accessible
- [ ] API calls work correctly
- [ ] Images and assets load
- [ ] No CORS errors
- [ ] Mobile responsive verified

---

## 🚀 IIS Configuration

### Application Pools
- [ ] Backend app pool created: `SLBFE_HRM_Pool`
  - [ ] .NET CLR Version: No Managed Code
  - [ ] Managed Pipeline Mode: Integrated
  - [ ] Identity: ApplicationPoolIdentity
  - [ ] Idle Timeout: 20 minutes
  - [ ] Recycling: Daily at 2 AM
- [ ] Frontend app pool created: `SLBFE_HRM_Frontend_Pool`
  - [ ] .NET CLR Version: No Managed Code

### Websites
- [ ] Backend site created
  - [ ] Name: SLBFE-HRM-API
  - [ ] Physical path: C:\inetpub\wwwroot\SLBFE-HRM-API
  - [ ] Application pool: SLBFE_HRM_Pool
  - [ ] HTTP binding: Port 5000
  - [ ] HTTPS binding: Port 5001 with certificate
- [ ] Frontend site created
  - [ ] Name: SLBFE-HRM-Frontend
  - [ ] Physical path: C:\inetpub\wwwroot\SLBFE-HRM-Frontend
  - [ ] Application pool: SLBFE_HRM_Frontend_Pool
  - [ ] HTTP binding: Port 80
  - [ ] HTTPS binding: Port 443 with certificate

### Permissions
- [ ] IIS_IUSRS has read/execute on application folders
- [ ] App pool identity has write on logs folder
- [ ] App pool identity has write on keys folder
- [ ] File upload directory has correct permissions
- [ ] Backup directory has correct permissions

---

## 📝 Logging & Monitoring

### Logging Configuration
- [ ] Serilog configured for production
- [ ] Log files writing successfully
- [ ] SQL Server logging enabled
- [ ] Log retention policy set (30 days)
- [ ] Log rotation working
- [ ] Error notifications configured

### Monitoring Setup
- [ ] Health check endpoint accessible (/health)
- [ ] Application Insights configured (optional)
- [ ] Performance counters enabled
- [ ] Disk space monitoring set up
- [ ] SQL Server monitoring configured
- [ ] Alert rules created for critical errors

---

## 💾 Backup & Recovery

### Backup Configuration
- [ ] Database full backup scheduled (Daily 2 AM)
- [ ] Database differential backup scheduled (Every 6 hours)
- [ ] Transaction log backup scheduled (Every 30 minutes)
- [ ] Application files backup scheduled
- [ ] Backup storage location accessible
- [ ] Backup retention policy defined
- [ ] Test restore performed successfully

### Disaster Recovery
- [ ] Recovery plan documented
- [ ] Backup verification automated
- [ ] Restore procedure tested
- [ ] Recovery time objective (RTO) defined
- [ ] Recovery point objective (RPO) defined
- [ ] Off-site backup location configured

---

## 🧪 Testing

### Unit Testing
- [ ] All unit tests pass
- [ ] Code coverage > 70%
- [ ] Critical paths tested
- [ ] Edge cases covered

### Integration Testing
- [ ] Database integration tested
- [ ] API endpoints tested
- [ ] Authentication flow tested
- [ ] Authorization rules verified
- [ ] File upload/download tested
- [ ] Email sending tested

### Performance Testing
- [ ] Load testing completed
- [ ] Stress testing completed
- [ ] Response times acceptable
- [ ] No memory leaks detected
- [ ] Database queries optimized
- [ ] Concurrent user load tested

### Security Testing
- [ ] SQL injection testing passed
- [ ] XSS protection verified
- [ ] CSRF protection tested
- [ ] Authentication bypass attempts failed
- [ ] Authorization checks verified
- [ ] Sensitive data encrypted

### User Acceptance Testing
- [ ] All user stories tested
- [ ] Business workflows verified
- [ ] Reports generated successfully
- [ ] Data accuracy verified
- [ ] User interface tested by end users
- [ ] Mobile/tablet testing completed

---

## 📚 Documentation

### Technical Documentation
- [ ] API documentation (Swagger) accessible
- [ ] Database schema documented
- [ ] Architecture diagrams created
- [ ] Deployment guide reviewed
- [ ] Configuration guide complete
- [ ] Troubleshooting guide available

### User Documentation
- [ ] User manual created
- [ ] Training materials prepared
- [ ] FAQ document created
- [ ] Video tutorials (if applicable)
- [ ] Quick start guide available

### Operational Documentation
- [ ] Runbook created
- [ ] Maintenance procedures documented
- [ ] Escalation procedures defined
- [ ] Contact list updated
- [ ] Change management process defined

---

## 👥 Team Preparation

### Training
- [ ] Development team trained
- [ ] IT operations team trained
- [ ] End users trained
- [ ] Help desk trained
- [ ] Management briefed

### Support
- [ ] Support schedule defined
- [ ] On-call rotation set up
- [ ] Issue tracking system ready
- [ ] Communication channels established
- [ ] Escalation matrix defined

---

## 🚦 Pre-Deployment Verification

### 24 Hours Before Deployment
- [ ] All stakeholders notified
- [ ] Deployment window scheduled
- [ ] Change control approved
- [ ] Rollback plan prepared
- [ ] Communication plan ready
- [ ] Support team on standby

### Just Before Deployment
- [ ] Production database backed up
- [ ] Current application backed up
- [ ] All pre-requisites verified
- [ ] Deployment scripts tested
- [ ] Go/No-Go decision made
- [ ] Team ready

---

## 🎯 Post-Deployment Verification

### Immediate Checks (Within 1 Hour)
- [ ] Application loads successfully
- [ ] Users can log in
- [ ] Database connectivity confirmed
- [ ] API endpoints responding
- [ ] No critical errors in logs
- [ ] Health check returns healthy
- [ ] SSL certificate working
- [ ] Email notifications working

### Within 24 Hours
- [ ] All features tested
- [ ] Performance metrics collected
- [ ] Error logs reviewed
- [ ] User feedback gathered
- [ ] Backup completed successfully
- [ ] Monitoring alerts verified

### Within 1 Week
- [ ] Full user acceptance testing
- [ ] Performance optimization as needed
- [ ] Fine-tune configurations
- [ ] Address any issues
- [ ] Update documentation
- [ ] Conduct post-deployment review

---

## 📊 Success Criteria

### Technical Criteria
- [ ] Application uptime > 99%
- [ ] API response time < 200ms average
- [ ] Database query time < 100ms average
- [ ] No critical errors
- [ ] All backups successful
- [ ] Security scans passed

### Business Criteria
- [ ] All user stories implemented
- [ ] User satisfaction > 85%
- [ ] No major bugs reported
- [ ] Training completed
- [ ] Documentation delivered
- [ ] Performance targets met

---

## ⚠️ Known Issues / Limitations

Document any known issues or limitations:

1. [ ] Issue #1: _______________________
   - Impact: _______________________
   - Workaround: _______________________
   - Planned fix: _______________________

2. [ ] Issue #2: _______________________
   - Impact: _______________________
   - Workaround: _______________________
   - Planned fix: _______________________

---

## ✅ Final Sign-Off

### Approvals Required

- [ ] **Development Lead**: ___________________ Date: _______
- [ ] **IT Operations Manager**: ___________________ Date: _______
- [ ] **Security Officer**: ___________________ Date: _______
- [ ] **Project Manager**: ___________________ Date: _______
- [ ] **Business Owner**: ___________________ Date: _______

---

## 📞 Emergency Contacts

### During Deployment
- **Project Manager**: _______________________
- **Lead Developer**: _______________________
- **Database Admin**: _______________________
- **Network Admin**: _______________________
- **Security Officer**: _______________________

### Post-Deployment Support
- **IT Helpdesk**: 1989
- **Development Team**: dev@slbfe.lk
- **IT Operations**: it@slbfe.lk

---

## 🔄 Rollback Plan

If deployment fails:

1. [ ] Stop new application
2. [ ] Restore previous application files
3. [ ] Restore database backup (if schema changed)
4. [ ] Start previous application
5. [ ] Verify functionality
6. [ ] Notify stakeholders
7. [ ] Schedule post-mortem meeting

---

**Checklist Completed By**: _______________________  
**Date**: _______________________  
**Signature**: _______________________

---

**Deploy with confidence! All checks completed = Successful deployment! 🚀**
